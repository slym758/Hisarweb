<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Technology;
use Illuminate\Database\Seeder;

/**
 * Faz 2 — builds the real department_technology pivot from each Technology's plain
 * `dept_slugs` array (slug → department id). Idempotent & non-destructive:
 * syncWithoutDetaching updates/creates pivot rows and never removes admin edits, so it is
 * safe to re-run. It does NOT touch the fuzzy display-name chips stored inside disease /
 * treatment `detail` — those stay plain display text.
 */
class RelationSeeder extends Seeder
{
    public function run(): void
    {
        $deptIdBySlug = Department::pluck('id', 'slug');
        $linked = 0;

        foreach (Technology::all() as $technology) {
            $slugs = $technology->dept_slugs ?? [];
            $sync = [];
            $position = 0;

            foreach ($slugs as $slug) {
                $deptId = $deptIdBySlug[$slug] ?? null;
                if ($deptId !== null) {
                    $sync[$deptId] = ['position' => $position++];
                }
            }

            if (! empty($sync)) {
                $technology->departments()->syncWithoutDetaching($sync);
                $linked += count($sync);
            }
        }

        $this->command?->info("RelationSeeder: {$linked} department_technology links ensured.");
    }
}
