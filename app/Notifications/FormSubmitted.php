<?php

namespace App\Notifications;

use App\Models\FormSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Delivered to a form's configured recipients when a public form is submitted. Queued
 * (the app runs a database queue worker). Carries only the submitted fields — recipients
 * are never exposed to the client, and no personal data is logged.
 */
class FormSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public FormSubmission $submission,
        public string $formTitle,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject($this->subjectLine())
            ->greeting($this->formTitle);

        $subject = $this->submission->payload['subject'] ?? null;
        if (is_string($subject) && $subject !== '') {
            $mail->line("Konu / Subject: {$subject}");
        }

        foreach ($this->fieldLines() as $line) {
            $mail->line($line);
        }

        $mail->line('KVKK açık rıza: '.optional($this->submission->consent_at)->toDateTimeString());

        return $mail;
    }

    private function subjectLine(): string
    {
        $who = $this->submission->payload['name']
            ?? $this->submission->payload['fullName']
            ?? $this->submission->payload['email']
            ?? '';

        return trim("[{$this->submission->key}] {$this->formTitle}".($who !== '' ? " — {$who}" : ''));
    }

    /**
     * Human-readable "Label: value" lines for every scalar/simple field in the payload.
     *
     * @return array<int, string>
     */
    private function fieldLines(): array
    {
        $lines = [];

        foreach ($this->submission->payload as $key => $value) {
            if ($key === 'subject') {
                continue;
            }

            $lines[] = ucfirst($key).': '.$this->stringify($value);
        }

        return $lines;
    }

    private function stringify(mixed $value): string
    {
        if (is_array($value)) {
            return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if (is_bool($value)) {
            return $value ? 'evet' : 'hayır';
        }

        return (string) ($value ?? '');
    }
}
