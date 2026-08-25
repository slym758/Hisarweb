<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-record SEO (polymorphic, attached to any content model or page) and 301 redirects
 * (old path → new path), used by a middleware when slugs change or migrating an old site.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_meta', function (Blueprint $table) {
            $table->id();
            $table->morphs('seoable');            // seoable_type + seoable_id
            $table->json('meta_title')->nullable();       // translatable
            $table->json('meta_description')->nullable(); // translatable
            $table->string('og_image_url')->nullable();
            $table->string('canonical')->nullable();
            $table->boolean('noindex')->default(false);
            $table->timestamps();
            $table->unique(['seoable_type', 'seoable_id']);
        });

        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->string('from_path')->unique();
            $table->string('to_path');
            $table->unsignedSmallInteger('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('hits')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redirects');
        Schema::dropIfExists('seo_meta');
    }
};
