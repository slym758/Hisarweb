<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Convert the hospitals translatable columns from `json` to `jsonb`.
 *
 * Postgres `json` has no equality operator, so `SELECT DISTINCT hospitals.*` — which Filament
 * runs for the Doctor form's belongsToMany hospitals multi-select options query — fails. `jsonb`
 * has one. Loss-less, non-destructive (same data, better type). Mirrors the departments fix.
 */
return new class extends Migration
{
    private array $columns = [
        'name', 'area', 'address', 'about', 'features', 'technologies',
        'transport', 'emergency', 'working_hours', 'gallery',
    ];

    public function up(): void
    {
        foreach ($this->columns as $column) {
            DB::statement("ALTER TABLE hospitals ALTER COLUMN {$column} TYPE jsonb USING {$column}::jsonb");
        }
    }

    public function down(): void
    {
        foreach ($this->columns as $column) {
            DB::statement("ALTER TABLE hospitals ALTER COLUMN {$column} TYPE json USING {$column}::json");
        }
    }
};
