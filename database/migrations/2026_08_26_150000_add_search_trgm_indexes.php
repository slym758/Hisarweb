<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * GIN pg_trgm indexes on the most-searched translatable name/title columns, backing the
 * DB-backed site search (Faz 8). Additive + idempotent (CREATE INDEX IF NOT EXISTS, each
 * wrapped in try/catch). The corpus is small, so these are a future-proofing nicety rather
 * than a hard requirement — a failure to create any one index is swallowed on purpose.
 *
 * NOTE: the search WHERE wraps columns in unaccent(), which is not IMMUTABLE and so cannot
 * be indexed directly; these lower(col) trgm indexes still accelerate similarity()/plain
 * ILIKE probes as the catalog grows.
 */
return new class extends Migration
{
    /** @var array<int,array{0:string,1:string,2:string}> [table, index name, expression] */
    private array $indexes = [
        ['departments', 'departments_name_tr_trgm', "lower(name->>'tr')"],
        ['departments', 'departments_name_en_trgm', "lower(name->>'en')"],
        ['departments', 'departments_blurb_tr_trgm', "lower(blurb->>'tr')"],
        ['doctors', 'doctors_name_trgm', 'lower(name)'],
        ['doctors', 'doctors_title_tr_trgm', "lower(title->>'tr')"],
        ['doctors', 'doctors_title_en_trgm', "lower(title->>'en')"],
        ['treatments', 'treatments_name_tr_trgm', "lower(name->>'tr')"],
        ['treatments', 'treatments_name_en_trgm', "lower(name->>'en')"],
        ['diseases', 'diseases_name_tr_trgm', "lower(name->>'tr')"],
        ['diseases', 'diseases_name_en_trgm', "lower(name->>'en')"],
        ['technologies', 'technologies_name_tr_trgm', "lower(name->>'tr')"],
        ['technologies', 'technologies_name_en_trgm', "lower(name->>'en')"],
        ['hospitals', 'hospitals_name_tr_trgm', "lower(name->>'tr')"],
        ['hospitals', 'hospitals_name_en_trgm', "lower(name->>'en')"],
    ];

    public function up(): void
    {
        foreach ($this->indexes as [$table, $name, $expr]) {
            try {
                DB::statement("create index if not exists {$name} on {$table} using gin (({$expr}) gin_trgm_ops)");
            } catch (Throwable $e) {
                // Non-critical: search works without the index (small corpus). Skip on failure.
            }
        }
    }

    public function down(): void
    {
        foreach ($this->indexes as [, $name]) {
            try {
                DB::statement("drop index if exists {$name}");
            } catch (Throwable $e) {
                // ignore
            }
        }
    }
};
