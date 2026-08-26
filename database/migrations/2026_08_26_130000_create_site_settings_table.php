<?php

use App\Support\SettingsService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Site-wide settings singleton store (call-center phone, WhatsApp, appointment CTA,
 * social links, …). One row per key; `value` holds either a scalar or a translatable
 * {tr,en,…} JSON map. Read (cached) via {@see SettingsService} and shared
 * to the frontend via Inertia. Additive — never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
