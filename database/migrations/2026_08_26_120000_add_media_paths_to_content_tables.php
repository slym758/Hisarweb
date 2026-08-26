<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Additive image-upload columns. Admin uploads store a public-disk path here; the seeded
 * `*_url` (Unsplash) stays as fallback. Serializers resolve via App\Support\Media::url()
 * (uploaded path wins, else the URL). Additive only — no data loss (DB-safety doctrine).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hospitals', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('hospital_rooms', fn (Blueprint $t) => $t->string('image_path')->nullable()->after('image_url'));
        Schema::table('doctors', fn (Blueprint $t) => $t->string('photo_path')->nullable()->after('photo_url'));
        Schema::table('diseases', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('treatments', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('technologies', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('blog_posts', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('events', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('health_packages', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('press_items', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
        Schema::table('videos', fn (Blueprint $t) => $t->string('poster_path')->nullable()->after('poster_url'));
        Schema::table('quality_certificates', function (Blueprint $t) {
            $t->string('logo_path')->nullable()->after('logo_url');
            $t->string('cover_path')->nullable()->after('cover_url');
        });
        Schema::table('departments', fn (Blueprint $t) => $t->string('cover_path')->nullable()->after('cover_url'));
    }

    public function down(): void
    {
        Schema::table('hospitals', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('hospital_rooms', fn (Blueprint $t) => $t->dropColumn('image_path'));
        Schema::table('doctors', fn (Blueprint $t) => $t->dropColumn('photo_path'));
        Schema::table('diseases', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('treatments', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('technologies', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('blog_posts', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('events', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('health_packages', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('press_items', fn (Blueprint $t) => $t->dropColumn('cover_path'));
        Schema::table('videos', fn (Blueprint $t) => $t->dropColumn('poster_path'));
        Schema::table('quality_certificates', fn (Blueprint $t) => $t->dropColumn(['logo_path', 'cover_path']));
        Schema::table('departments', fn (Blueprint $t) => $t->dropColumn('cover_path'));
    }
};
