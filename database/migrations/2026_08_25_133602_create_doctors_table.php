<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Doctors. Public route key is `code` (d1…) to keep existing URLs byte-identical;
 * `slug` is added now (nullable) so a future SEO switch to /doktor/{slug} is routing-only.
 * `cv` holds the whole DoctorCv object as translatable JSON.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();          // 'd1'..'d17' — public route key
            $table->string('slug')->nullable();        // future SEO slug
            $table->string('name');                    // proper noun — plain (same all locales)
            $table->json('title');                     // translatable
            $table->json('bio')->nullable();           // translatable
            $table->json('subspecialties')->nullable(); // translatable array
            $table->json('languages')->nullable();     // translatable array
            $table->json('cv')->nullable();            // translatable DoctorCv object
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hospital_id')->constrained()->cascadeOnDelete();
            $table->string('email')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
