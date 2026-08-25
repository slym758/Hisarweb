<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Enables the PostgreSQL `pg_trgm` (trigram similarity — typo tolerance) and
 * `unaccent` (diacritic folding) extensions used by the site search (Faz 8).
 * Set up here in the CMS foundation so later phases can build trigram indexes.
 * Only meaningful on pgsql; skipped on other drivers.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE EXTENSION IF NOT EXISTS unaccent');
    }

    public function down(): void
    {
        // Extensions are shared infrastructure; leave them in place on rollback
        // rather than risk dropping something another feature depends on.
    }
};
