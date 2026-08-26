<?php

namespace App\Console\Commands;

use App\Models\Hospital;
use Illuminate\Console\Command;

/**
 * Seeds the explicit Hospital↔Department links from the existing doctor-derived mapping, once.
 * Idempotent and additive: uses syncWithoutDetaching, so it only ADDS the departments a hospital's
 * doctors imply and NEVER removes an editor's manual choices. Safe to re-run.
 */
class BackfillHospitalDepartments extends Command
{
    protected $signature = 'hisar:backfill-hospital-departments';

    protected $description = 'Populate department_hospital from doctor assignments (idempotent, additive).';

    public function handle(): int
    {
        foreach (Hospital::with('doctors:id,hospital_id,department_id')->get() as $hospital) {
            $departmentIds = $hospital->doctors
                ->pluck('department_id')
                ->filter()
                ->unique()
                ->values()
                ->all();

            $hospital->departments()->syncWithoutDetaching($departmentIds);

            $this->line(sprintf('%-22s +%d bölüm', $hospital->slug, count($departmentIds)));
        }

        $this->info('Bitti — mevcut editör seçimleri korundu (hiçbir şey silinmedi).');

        return self::SUCCESS;
    }
}
