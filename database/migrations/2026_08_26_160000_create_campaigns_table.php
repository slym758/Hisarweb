<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Editor-created, time-boxed landing pages ("kampanyalar") — each with its own URL
 * (/kampanya/{slug}) for medical-tourism / advertising traffic (TR + EN + DE + AR …).
 * Translatable copy (title/subtitle/body/cta_label/seo_*) holds a {tr,en,…} JSON map
 * (spatie/translatable). The hero image follows the project convention: an uploaded
 * `hero_image_path` (public disk) wins, else the `hero_image_url` fallback — resolved
 * via App\Support\Media::url(). A campaign is live only when `is_active` and within its
 * optional [starts_at, ends_at] window (see Campaign::scopeActive). Additive & never
 * wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');                    // translatable
            $table->json('subtitle')->nullable();     // translatable
            $table->string('hero_image_path')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->json('body')->nullable();         // translatable paragraph array
            $table->json('cta_label')->nullable();    // translatable
            $table->string('cta_link')->nullable();
            $table->json('seo_title')->nullable();     // translatable
            $table->json('seo_description')->nullable(); // translatable
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'starts_at', 'ends_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
