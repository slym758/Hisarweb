<?php

use App\Support\PageContentService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Editable page registry: one row per public route (slug is the route key, e.g.
 * 'kurumsal', 'home', 'vizyon-misyon'). Holds the admin label (`title`) and per-page
 * SEO (`seo_title`, `seo_description`, og image) as translatable {tr,en,…} JSON maps.
 * The page body copy lives in `page_contents`. Read (cached, locale-resolved) via
 * {@see PageContentService}. Additive — never wipes existing data; when the
 * table/rows are empty the frontend falls back to each page's inline COPY.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title')->nullable();
            $table->json('seo_title')->nullable();
            $table->json('seo_description')->nullable();
            $table->string('og_image_path')->nullable();
            $table->string('og_image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
