<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Custom uploaded department icon (image/SVG). When set it is used instead of the
 * lucide icon-name (`icon`). Additive (DB-safety doctrine).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->string('icon_path')->nullable()->after('icon');
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('icon_path');
        });
    }
};
