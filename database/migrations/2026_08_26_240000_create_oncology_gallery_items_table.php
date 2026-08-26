<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Bütünleşik Onkoloji Merkezi Turu" gallery — previously a hard-coded image array + copy
 * captions on the butunlesik-onkoloji page. Each item is an uploadable image with a
 * translatable title/caption. jsonb for the translatable columns (Postgres-safe).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oncology_gallery_items', function (Blueprint $table) {
            $table->id();
            $table->jsonb('title')->nullable();   // translatable {tr,en,…}
            $table->jsonb('desc')->nullable();    // translatable {tr,en,…}
            $table->string('image_path')->nullable();
            $table->string('image_url')->nullable();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->integer('order_column')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oncology_gallery_items');
    }
};
