<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lets a mobile bottom-nav item be shown only on certain page types (home / detail / other).
 * Empty/null = shown on all pages. Only the mobile bottom nav honours it; other menus ignore it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->jsonb('page_types')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('page_types');
        });
    }
};
