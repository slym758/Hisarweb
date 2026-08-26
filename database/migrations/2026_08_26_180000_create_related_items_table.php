<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Faz 2 — editorial related-content overrides. A row links a source record
 * (e.g. a Doctor) to a target record (e.g. a Treatment) under a named `relation`.
 * When any manual rows exist for a (source, target_type, relation) triple they REPLACE
 * the automatic same-department resolution; otherwise the auto resolver is used
 * (see App\Support\AutoRelatedResolver + App\Models\Concerns\HasRelatedContent).
 * Additive & polymorphic — no existing table is touched.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('related_items', function (Blueprint $table) {
            $table->id();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id');
            $table->string('target_type');
            $table->unsignedBigInteger('target_id');
            $table->string('relation')->default('related');
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->index(['source_type', 'source_id', 'relation']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('related_items');
    }
};
