<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Admin-managed set of site languages. Drives the supported-locale list, the site
 * language switcher, locale route prefixes (/en, /de, /ar…), RTL, and the fallback
 * chain. Adding a language here needs no migration — translatable JSON columns hold
 * any locale key. Exactly one row is the default (served at the root, no prefix).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('code', 12)->unique();          // BCP-47 short code: tr, en, ar, pt-br…
            $table->string('name');                         // English/admin name: "Turkish"
            $table->string('native_name');                  // endonym: "Türkçe", "العربية"
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);  // the root, unprefixed locale
            $table->boolean('is_rtl')->default(false);
            $table->string('fallback_code', 12)->nullable(); // where missing translations fall back
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
