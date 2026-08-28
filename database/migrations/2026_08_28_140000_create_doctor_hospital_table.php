<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A doctor can practise at multiple hospitals (with an order). Adds a doctor_hospital pivot and
 * backfills it from the existing single hospital_id (which stays as the primary hospital). The
 * pivot's `position` orders a doctor's hospitals. Additive.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_hospital', function (Blueprint $table) {
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hospital_id')->constrained()->cascadeOnDelete();
            $table->integer('position')->default(0);
            $table->unique(['doctor_id', 'hospital_id']);
        });

        // Backfill from the current primary hospital.
        foreach (DB::table('doctors')->whereNotNull('hospital_id')->get(['id', 'hospital_id']) as $d) {
            DB::table('doctor_hospital')->insertOrIgnore([
                'doctor_id' => $d->id,
                'hospital_id' => $d->hospital_id,
                'position' => 0,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_hospital');
    }
};
