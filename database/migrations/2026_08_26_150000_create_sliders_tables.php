<?php

use App\Support\SliderService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Admin-managed media sliders/banners. `sliders` is keyed by `placement` (e.g. home_hero);
 * `slides` is its ordered child set. Image references follow the project convention:
 * an uploaded `*_path` (public disk) wins, else the seeded `*_url` fallback — resolved via
 * App\Support\Media::url(). Translatable slide copy (eyebrow/title/… ) holds a {tr,en,…}
 * JSON map (spatie/translatable). Read (cached) via {@see SliderService} and shared to the
 * frontend; the in-memory hero stays as a fallback. Additive — never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->string('placement'); // e.g. home_hero
            $table->boolean('autoplay')->default(true);
            $table->unsignedInteger('interval_ms')->default(3000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('placement');
        });

        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('slider_id')->constrained()->cascadeOnDelete();
            $table->string('image_path')->nullable();
            $table->string('image_url')->nullable();
            $table->string('mobile_image_path')->nullable();
            $table->string('mobile_image_url')->nullable();
            $table->string('position')->nullable();          // CSS object-position, e.g. "50% 78%"
            $table->string('mobile_position')->nullable();
            $table->string('link')->nullable();
            $table->json('eyebrow')->nullable();             // translatable {tr,en,…}
            $table->json('title')->nullable();               // translatable
            $table->json('mobile_title')->nullable();        // translatable
            $table->json('desc')->nullable();                // translatable
            $table->json('mobile_desc')->nullable();         // translatable
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();

            $table->index(['slider_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slides');
        Schema::dropIfExists('sliders');
    }
};
