<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Özel Merkezler" homepage cards — previously a hard-coded image/link array + copy captions.
 * Each card is an uploadable image + a link + translatable name/desc/accent, so editors control
 * which centers appear (and their order). jsonb for the translatable columns.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_centers', function (Blueprint $table) {
            $table->id();
            $table->jsonb('name')->nullable();     // translatable
            $table->jsonb('desc')->nullable();     // translatable
            $table->jsonb('accent')->nullable();   // translatable (branch label)
            $table->string('link')->nullable();
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
        Schema::dropIfExists('home_centers');
    }
};
