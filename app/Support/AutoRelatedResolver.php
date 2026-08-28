<?php

namespace App\Support;

use App\Models\Department;
use App\Models\Hospital;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

/**
 * Centralizes the "related by same department" logic that used to live in the frontend
 * getXForDept helpers. Given a source model and a target class, returns published, ordered
 * target records that share the source's department, excluding the source itself.
 *
 * Department resolution: most models expose a single `department_id`; a Technology is
 * multi-department (via the department_technology pivot, falling back to its `dept_slugs`).
 * A Technology *target* is likewise matched through the pivot / dept_slugs.
 */
class AutoRelatedResolver
{
    /**
     * @param  class-string  $targetClass
     * @return Collection<int, Model>
     */
    public static function resolve(Model $model, string $targetClass, int $limit = 12): Collection
    {
        $deptIds = self::departmentIdsFor($model);

        if (empty($deptIds)) {
            /** @var Collection<int, Model> */
            return new Collection;
        }

        /** @var Builder $query */
        $query = $targetClass::query()->published()->ordered();

        if ($targetClass === Technology::class) {
            $slugs = Department::whereIn('id', $deptIds)->pluck('slug')->all();
            $query->where(function (Builder $q) use ($deptIds, $slugs) {
                $q->whereHas('departments', fn (Builder $d) => $d->whereIn('departments.id', $deptIds));
                foreach ($slugs as $slug) {
                    $q->orWhereJsonContains('dept_slugs', $slug);
                }
            });
        } elseif (Schema::hasColumn((new $targetClass)->getTable(), 'department_id')) {
            $query->whereIn('department_id', $deptIds);
        } else {
            // Target isn't department-scoped (e.g. press, hospitals) — auto has nothing to offer;
            // these are manual-only.
            /** @var Collection<int, Model> */
            return new Collection;
        }

        // Exclude the source itself when source and target are the same type.
        if ($model instanceof $targetClass) {
            $query->whereKeyNot($model->getKey());
        }

        return $query->limit($limit)->get();
    }

    /**
     * The department id(s) a model belongs to.
     *
     * @return array<int, int>
     */
    protected static function departmentIdsFor(Model $model): array
    {
        // A Department is its own department (auto content = content in this department).
        if ($model instanceof Department) {
            return [(int) $model->getKey()];
        }

        if ($model instanceof Technology) {
            $ids = $model->departments()->pluck('departments.id')->all();

            if (empty($ids) && ! empty($model->dept_slugs)) {
                $ids = Department::whereIn('slug', $model->dept_slugs)->pluck('id')->all();
            }

            return array_map('intval', $ids);
        }

        // A hospital has no single department. Prefer its explicit department links; when the
        // editor hasn't set any, fall back to the departments represented by its doctors.
        if ($model instanceof Hospital) {
            $ids = $model->departments()->pluck('departments.id')->all();

            if (empty($ids)) {
                $ids = $model->doctors()
                    ->whereNotNull('department_id')
                    ->distinct()
                    ->pluck('department_id')
                    ->all();
            }

            return array_map('intval', $ids);
        }

        return $model->department_id ? [(int) $model->department_id] : [];
    }
}
