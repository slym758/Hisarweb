<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Editor-managed pop-ups / promos (Faz 6b) — the mobile app-promo popup and generic
 * modals/banners/lead widgets. Translatable copy (title/body/cta_label) holds a {tr,en,…}
 * JSON map (spatie/translatable). The image follows the project media convention: an
 * uploaded `image_path` (public disk) wins, else the `image_url` fallback — resolved via
 * App\Support\Media::url(). Visibility is scoped by locale-agnostic path globs:
 * `target_routes` (empty/null = every route) minus `suppress_routes`. A popup is live only
 * when `is_active` and within its optional [starts_at, ends_at] window (see Popup::scopeActive).
 * `dismiss_scope` (session|days) + `dismiss_days` drive how long a dismissal sticks on the
 * client. Ordered by `priority` (desc). Additive & never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('popups', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('app_promo'); // app_promo|modal|banner|lead
            $table->json('title')->nullable();             // translatable
            $table->json('body')->nullable();              // translatable
            $table->json('cta_label')->nullable();         // translatable
            $table->string('image_path')->nullable();
            $table->string('image_url')->nullable();
            $table->string('cta_link')->nullable();
            $table->json('target_routes')->nullable();     // path globs where shown; empty/null = all
            $table->json('suppress_routes')->nullable();   // path globs where hidden
            $table->string('dismiss_scope')->default('session'); // session|days
            $table->integer('dismiss_days')->default(7);
            $table->boolean('is_active')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->integer('priority')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'starts_at', 'ends_at']);
            $table->index(['type', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('popups');
    }
};
