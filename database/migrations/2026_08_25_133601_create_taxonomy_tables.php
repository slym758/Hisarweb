<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Departments (the catalog's central hub), hospitals and their room types.
 * Translatable fields are JSON columns holding {"tr":…,"en":…,…} (spatie/translatable).
 * `status` + `published_at` give a consistent draft/published workflow across content.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('blurb')->nullable();    // translatable
            $table->string('icon')->nullable();   // lucide icon name
            $table->boolean('pinned')->default(false);
            $table->string('cover_url')->nullable();
            $table->json('about')->nullable();          // translatable (DepartmentDetail.about[])
            $table->json('technologies')->nullable();   // translatable (DepartmentDetail.technologies[])
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('hospitals', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('area')->nullable();     // translatable
            $table->string('phone')->nullable();
            $table->json('address')->nullable();  // translatable
            $table->boolean('coming_soon')->default(false);
            $table->string('cover_url')->nullable();
            $table->json('about')->nullable();          // translatable
            $table->json('features')->nullable();       // translatable
            $table->json('technologies')->nullable();   // translatable
            $table->json('transport')->nullable();      // translatable
            $table->json('emergency')->nullable();      // translatable
            $table->json('working_hours')->nullable();  // translatable
            $table->string('map_query')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('hospital_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hospital_id')->constrained()->cascadeOnDelete();
            $table->json('name');                 // translatable
            $table->json('description')->nullable(); // translatable
            $table->string('image_url')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hospital_rooms');
        Schema::dropIfExists('hospitals');
        Schema::dropIfExists('departments');
    }
};
