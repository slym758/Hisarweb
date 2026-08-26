<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Whole-page marketing copy as one translatable JSON tree per page (mirrors the page's
 * inline `COPY` object). The frontend deep-merges the DB copy over the inline COPY
 * (usePageCopy), so any text becomes editable while empty keys fall back to code.
 * Additive (DB-safety doctrine).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->json('copy')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('copy');
        });
    }
};
