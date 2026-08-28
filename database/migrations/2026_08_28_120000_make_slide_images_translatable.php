<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Make slider/banner slide images translatable (per-language banners — an image with text baked
 * in for a specific language). Converts each plain image column into a jsonb {tr: value} map,
 * loss-lessly. A locale with no image falls back down the fallback chain to the default one.
 */
return new class extends Migration
{
    private array $columns = ['image_path', 'image_url', 'mobile_image_path', 'mobile_image_url'];

    public function up(): void
    {
        foreach ($this->columns as $col) {
            DB::statement("ALTER TABLE slides ALTER COLUMN {$col} TYPE jsonb USING (CASE WHEN {$col} IS NULL OR {$col} = '' THEN NULL ELSE json_build_object('tr', {$col}) END)::jsonb");
        }
    }

    public function down(): void
    {
        foreach ($this->columns as $col) {
            DB::statement("ALTER TABLE slides ALTER COLUMN {$col} TYPE varchar(255) USING ({$col}->>'tr')");
        }
    }
};
