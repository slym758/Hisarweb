<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Diseases, treatments and technologies. Each keeps its rich `detail` object as a single
 * translatable JSON column (mirrors the TS `detail` shape 1:1 → mechanical seed). The
 * chip/relation arrays inside detail become real M2M pivots in Faz 2; `dept_slugs` on
 * technologies is preserved (plain JSON) so those pivots can be built later.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diseases', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('summary')->nullable();  // translatable
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('cover_url')->nullable();
            $table->json('detail')->nullable();   // translatable DiseaseDetail object
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('treatments', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('summary')->nullable();  // translatable
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('cover_url')->nullable();
            $table->json('detail')->nullable();   // translatable TreatmentDetail object
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });

        Schema::create('technologies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('name');                 // translatable
            $table->json('description')->nullable(); // translatable (TS `desc`)
            $table->string('cover_url')->nullable();
            $table->json('detail')->nullable();   // translatable TechnologyDetail (what/how/advantages, diseaseSlugs/treatmentSlugs)
            $table->json('dept_slugs')->nullable(); // plain — preserved for the Faz 2 department_technology pivot
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order_column')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('technologies');
        Schema::dropIfExists('treatments');
        Schema::dropIfExists('diseases');
    }
};
