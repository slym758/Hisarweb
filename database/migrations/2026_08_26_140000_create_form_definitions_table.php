<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Admin-managed configuration for each public form (contact, appointment, ask-a-doctor,
 * call-me-back, feedback, survey, HR). One row per `key`. Translatable columns hold a
 * {tr,en,…} JSON map (spatie/translatable). `recipients` is a JSON array of e-mail
 * addresses the submission is delivered to. Additive — never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('title');
            $table->json('recipients')->nullable();
            $table->json('subjects')->nullable();
            $table->json('kvkk_text')->nullable();
            $table->json('success_message')->nullable();
            $table->json('error_message')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_definitions');
    }
};
