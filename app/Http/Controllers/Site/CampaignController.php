<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Support\Media;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public landing page for a single campaign. Loads the active campaign by slug
 * (an unknown or expired/inactive slug → firstOrFail() → a real 404) and passes it,
 * locale-resolved via loc(), as the `record` prop the page renders.
 */
class CampaignController extends Controller
{
    public function show(string $slug): Response
    {
        $campaign = Campaign::where('slug', $slug)->active()->firstOrFail();

        return Inertia::render('site/kampanya-detay', [
            'slug' => $slug,
            'record' => [
                'title' => $campaign->loc('title'),
                'subtitle' => $campaign->loc('subtitle') ?? '',
                'body' => $campaign->loc('body') ?? [],
                'cta_label' => $campaign->loc('cta_label') ?? '',
                'cta_link' => $campaign->cta_link ?? '',
                'hero' => Media::url($campaign->hero_image_path, $campaign->hero_image_url),
                'seo_title' => $campaign->loc('seo_title') ?? '',
                'seo_description' => $campaign->loc('seo_description') ?? '',
            ],
        ]);
    }
}
