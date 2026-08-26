<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Faz 2 — real M2M pivot between departments and technologies. Built by RelationSeeder
 * from each Technology's plain `dept_slugs` array (see the create_medical_tables note).
 * `position` keeps editor ordering; additive, no existing table changes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_technology', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('technology_id')->constrained()->cascadeOnDelete();
            $table->integer('position')->default(0);

            $table->unique(['department_id', 'technology_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_technology');
    }
};
