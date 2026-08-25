<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Remaining content entities: blog posts, videos, events, health packages, press items,
 * FAQ categories, symptom→department map, and quality certificates.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');                // translatable
            $table->json('excerpt')->nullable();  // translatable
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete(); // was `category`
            $table->string('cover_url')->nullable();
            $table->json('body')->nullable();     // translatable paragraph array
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable(); // the article date
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();     // 'v1'… (no detail route)
            $table->json('title');                // translatable
            $table->string('youtube_id');
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->json('category')->nullable(); // translatable
            $table->string('duration')->nullable();
            $table->string('poster_url')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');                // translatable
            $table->json('excerpt')->nullable();  // translatable
            $table->json('body')->nullable();     // translatable
            $table->json('place')->nullable();    // translatable
            $table->date('starts_at')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('health_packages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('summary')->nullable();  // translatable
            $table->json('scope')->nullable();    // translatable bullet array
            $table->string('cover_url')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('press_items', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');                // translatable
            $table->json('excerpt')->nullable();  // translatable
            $table->string('source')->nullable(); // publication name — plain
            $table->string('cover_url')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable(); // press date
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('faq_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');                // translatable
            $table->json('items')->nullable();    // translatable [{q,a}] array
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('symptom_maps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->json('label');                // translatable
            $table->json('keywords');             // translatable array
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('quality_certificates', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('issuer')->nullable();   // translatable
            $table->date('issued_at')->nullable();
            $table->date('valid_until')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('cover_url')->nullable();
            $table->foreignId('hospital_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quality_certificates');
        Schema::dropIfExists('symptom_maps');
        Schema::dropIfExists('faq_categories');
        Schema::dropIfExists('press_items');
        Schema::dropIfExists('health_packages');
        Schema::dropIfExists('events');
        Schema::dropIfExists('videos');
        Schema::dropIfExists('blog_posts');
    }
};
