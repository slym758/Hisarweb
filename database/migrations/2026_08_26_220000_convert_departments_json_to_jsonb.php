<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Convert the departments translatable columns from `json` to `jsonb`.
 *
 * Postgres `json` has no equality operator, so `SELECT DISTINCT departments.*` — which Filament
 * runs for the Hospital form's belongsToMany departments multi-select — fails. `jsonb` has one.
 * The conversion is loss-less (every json value casts to jsonb) and non-destructive; it only
 * changes the storage type, not the data.
 */
return new class extends Migration
{
    private array $columns = ['name', 'blurb', 'about', 'technologies'];

    public function up(): void
    {
        foreach ($this->columns as $column) {
            DB::statement("ALTER TABLE departments ALTER COLUMN {$column} TYPE jsonb USING {$column}::jsonb");
        }
    }

    public function down(): void
    {
        foreach ($this->columns as $column) {
            DB::statement("ALTER TABLE departments ALTER COLUMN {$column} TYPE json USING {$column}::json");
        }
    }
};
