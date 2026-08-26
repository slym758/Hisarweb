<?php

namespace App\Http\Controllers;

use App\Models\FormDefinition;
use App\Models\FormSubmission;
use App\Notifications\FormSubmitted;
use App\Support\LocaleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

/**
 * Handles every public form POST (`/form/{key}`). Enforces the legal/security rules:
 * KVKK explicit consent is required and its acceptance timestamp is recorded; a honeypot
 * field + the route's throttle middleware guard against spam; validation is server-side
 * (never trusting the client). Recipients are resolved from the admin-managed
 * {@see FormDefinition} and never exposed to the client. Personal data is never logged.
 */
class FormSubmissionController extends Controller
{
    /**
     * Keys stripped from the stored payload / e-mail (control + consent + honeypot).
     */
    private const NON_PAYLOAD_KEYS = ['kvkk', 'website', '_token', '_method', 'cv', 'locale'];

    public function store(Request $request, string $key): RedirectResponse
    {
        $definition = FormDefinition::active($key);

        abort_if($definition === null, 404);

        // Honeypot: a real user never fills the hidden `website` field. If it's filled,
        // pretend success (no store, no mail) so bots can't distinguish a rejection.
        if ($request->filled('website')) {
            return back()->with('form_success', true);
        }

        // STRICT on consent + honeypot; permissive on the actual fields. Known fields are
        // format-checked; any extra fields are still captured into the payload below.
        $request->validate([
            'kvkk' => ['required', 'accepted'],
            'website' => ['nullable', 'max:0'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
            'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        // Payload = everything submitted minus control/consent/honeypot keys and files.
        $payload = collect($request->except(self::NON_PAYLOAD_KEYS))
            ->reject(fn ($value) => $value === null || $value === '')
            ->all();

        // CV upload (İK): validated above (pdf/doc/docx, ≤5MB); stored on the private disk.
        if ($request->hasFile('cv')) {
            $path = $request->file('cv')->store('form-uploads/'.$key, 'local');
            $payload['cv_path'] = $path;
            $payload['cv_name'] = $request->file('cv')->getClientOriginalName();
        }

        $submission = FormSubmission::create([
            'form_definition_id' => $definition->id,
            'key' => $key,
            'payload' => $payload,
            'locale' => $this->resolveLocale($request),
            'consent_at' => now(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'new',
        ]);

        $recipients = array_filter((array) $definition->recipients);

        if ($recipients !== []) {
            Notification::route('mail', $recipients)
                ->notify(new FormSubmitted($submission, (string) $definition->getTranslation('title', app()->getLocale())));
        }

        // Never expose recipients to the client; the flash flag is belt-and-suspenders —
        // the frontend drives its success UI from Inertia's onSuccess callback.
        return back()->with('form_success', true);
    }

    private function resolveLocale(Request $request): string
    {
        $locale = (string) $request->input('locale');
        $known = array_column(LocaleService::all(), 'code');

        return in_array($locale, $known, true) ? $locale : app()->getLocale();
    }
}
