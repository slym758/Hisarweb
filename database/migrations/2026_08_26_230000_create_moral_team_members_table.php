<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Moral Takımı" (Integrated Oncology morale team) members — previously a hard-coded array on
 * the moral-takimi page. Each member has a name, a translatable role, a portrait, and an
 * optional gallery of visit photos. jsonb for the translatable/array columns (Postgres-safe).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('moral_team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->jsonb('role')->nullable();          // translatable {tr,en,…}
            $table->string('photo_path')->nullable();
            $table->string('photo_url')->nullable();
            $table->jsonb('gallery')->nullable();        // list of visit-photo paths/urls
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->integer('order_column')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moral_team_members');
    }
};
