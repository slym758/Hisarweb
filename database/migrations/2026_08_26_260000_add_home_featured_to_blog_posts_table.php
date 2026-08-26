<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lets an editor pick which blog posts appear in the homepage "Rehber" (Healthy Living Guide)
 * highlights, instead of always the latest 4. Additive boolean; when none are flagged the
 * homepage falls back to the most recent posts.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->boolean('home_featured')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn('home_featured');
        });
    }
};
