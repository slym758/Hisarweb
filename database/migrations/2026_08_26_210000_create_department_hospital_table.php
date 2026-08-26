<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Explicit Hospital ↔ Department link. Makes "which departments a hospital has" a first-class,
 * editable fact instead of deriving it from doctor assignments. Additive: when a hospital has
 * no rows here, the app falls back to the doctor-derived set (AutoRelatedResolver).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_hospital', function (Blueprint $table) {
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hospital_id')->constrained()->cascadeOnDelete();
            $table->unique(['department_id', 'hospital_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_hospital');
    }
};
