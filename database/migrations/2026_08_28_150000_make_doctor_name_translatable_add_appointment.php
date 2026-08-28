<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Doctor: make the name translatable (per-language), and add doctor-specific appointment fields
 * (an appointment URL + a translatable note). The name conversion wraps the existing plain value
 * into jsonb {tr: value}, loss-lessly. Additive/non-destructive.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE doctors ALTER COLUMN name TYPE jsonb USING (CASE WHEN name IS NULL OR name = '' THEN NULL ELSE json_build_object('tr', name) END)::jsonb");

        Schema::table('doctors', function (Blueprint $table) {
            $table->string('appointment_url')->nullable();
            $table->jsonb('appointment_note')->nullable();   // translatable
        });
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE doctors ALTER COLUMN name TYPE varchar(255) USING (name->>'tr')");

        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['appointment_url', 'appointment_note']);
        });
    }
};
