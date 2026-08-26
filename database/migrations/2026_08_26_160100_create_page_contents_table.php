<?php

use App\Support\PageContentService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Editable page-body blocks: each row is one addressable piece of copy on a page,
 * keyed by (`page_slug`, `section`, `key`). `type` marks how it's rendered
 * (text/richtext/list/link/image); `value` is a translatable {tr,en,…} JSON map.
 * Ordered within a page by `sort_order`. Read (cached, locale-resolved) via
 * {@see PageContentService} and consumed on the frontend by the
 * `useContent(slug)` hook — which falls back to inline COPY when a key is absent.
 * Additive — never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug')->index();
            $table->string('section');
            $table->string('key');
            $table->string('type')->default('text');
            $table->json('value')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['page_slug', 'section', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
