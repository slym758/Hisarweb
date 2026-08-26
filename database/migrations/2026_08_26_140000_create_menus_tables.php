<?php

use App\Support\MenuService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Admin-managed site navigation. `menus` is a small fixed set of locations (header,
 * footer, rail, bottom_nav); `menu_items` is a nestable tree per menu (header goes up to
 * 3 levels: group → column → leaf). Translatable fields (`label`, `badge`) hold a
 * {"tr":…,"en":…} JSON map (spatie/translatable). Read (cached) via
 * {@see MenuService} and shared to the frontend via Inertia; the in-memory
 * navigation stays as a fallback. Additive — never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('location')->unique(); // header | footer | rail | bottom_nav
            $table->string('label')->nullable();
            $table->timestamps();
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->cascadeOnDelete();
            $table->string('key')->nullable();          // stable NavItem key (header top level)
            $table->json('label');                       // translatable {tr,en,…}
            $table->boolean('column_group')->default(false); // true = mega-menu column header
            $table->string('link_type')->default('internal'); // internal | external | none
            $table->string('route')->nullable();         // internal path, e.g. /bolumlerimiz
            $table->string('url')->nullable();           // external href
            $table->json('badge')->nullable();           // translatable, e.g. "Yakında"
            $table->string('icon')->nullable();          // lucide icon name (rail/bottom_nav)
            $table->json('matches')->nullable();         // active-state paths (group top level)
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['menu_id', 'parent_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menus');
    }
};
