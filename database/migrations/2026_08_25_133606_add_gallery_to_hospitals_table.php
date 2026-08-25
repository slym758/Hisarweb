<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Hospital photo gallery [{image, caption}]. Stored as translatable JSON for now
 * (caption is localized); images migrate to the media library in Faz 3.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hospitals', function (Blueprint $table) {
            $table->json('gallery')->nullable()->after('technologies');
        });
    }

    public function down(): void
    {
        Schema::table('hospitals', function (Blueprint $table) {
            $table->dropColumn('gallery');
        });
    }
};
