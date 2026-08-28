<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-language slug overrides. Adds a nullable jsonb `slug_i18n` ({locale: slug}) to the
 * slug-routed content tables. The canonical `slug` stays the identity + fallback; when a locale
 * has an override, that locale's URL uses it and routing resolves it (see ContentModel::
 * localizedSlug / scopeWhereLocalizedSlug). Empty → current behaviour, so this is additive/safe.
 */
return new class extends Migration
{
    private array $tables = [
        'departments', 'diseases', 'treatments', 'technologies', 'hospitals',
        'events', 'health_packages', 'press_items', 'blog_posts',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->jsonb('slug_i18n')->nullable();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn('slug_i18n');
            });
        }
    }
};
