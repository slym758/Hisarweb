<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Make hospitals.phone translatable (per-language phone numbers). Converts the existing plain
 * varchar value into a jsonb {tr: value} map, loss-lessly, so spatie/translatable can resolve
 * it per locale. Non-destructive.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE hospitals ALTER COLUMN phone TYPE jsonb USING (CASE WHEN phone IS NULL OR phone = '' THEN NULL ELSE json_build_object('tr', phone) END)::jsonb");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE hospitals ALTER COLUMN phone TYPE varchar(255) USING (phone->>'tr')");
    }
};
