<?php

namespace App\Models\Concerns;

use App\Models\BlogPost;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\PressItem;
use App\Models\RelatedItem;
use App\Models\Technology;
use App\Models\Treatment;
use App\Models\Video;
use App\Support\AutoRelatedResolver;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Gives a content model editorial + automatic related content.
 *
 * `relatedItems($targetClass)` returns the manual picks (rows in `related_items` ordered
 * by position, mapped to their target models) when the editor has authored any; otherwise
 * it delegates to {@see AutoRelatedResolver} for same-department auto results. This is the
 * single seam detail-page controllers call.
 *
 * The `related<Target>()` morph relations exist so Filament repeaters can edit each
 * target-type block independently (each is scoped to one target_type + relation).
 */
trait HasRelatedContent
{
    /**
     * Manual override → else auto by department. Returns target models (self excluded by
     * the resolver), preserving editor order and dropping any dangling references.
     *
     * @param  class-string  $targetClass
     * @return Collection<int, Model>
     */
    public function relatedItems(string $targetClass, string $relation = 'related', int $limit = 12): Collection
    {
        $rows = RelatedItem::query()
            ->where('source_type', static::class)
            ->where('source_id', $this->getKey())
            ->where('target_type', $targetClass)
            ->where('relation', $relation)
            ->orderBy('position')
            ->get();

        if ($rows->isEmpty()) {
            return AutoRelatedResolver::resolve($this, $targetClass, $limit);
        }

        $targets = $targetClass::query()
            ->whereIn((new $targetClass)->getKeyName(), $rows->pluck('target_id')->all())
            ->get()
            ->keyBy(fn ($m) => $m->getKey());

        return $rows
            ->map(fn (RelatedItem $r) => $targets->get($r->target_id))
            ->filter()
            ->values();
    }

    /** Scoped morph relation for one target type (used by the Filament editors). */
    protected function relatedMorph(string $targetClass, string $relation = 'related'): MorphMany
    {
        return $this->morphMany(RelatedItem::class, 'source')
            ->where('target_type', $targetClass)
            ->where('relation', $relation)
            ->orderBy('position');
    }

    public function relatedTreatments(): MorphMany
    {
        return $this->relatedMorph(Treatment::class);
    }

    public function relatedDiseases(): MorphMany
    {
        return $this->relatedMorph(Disease::class);
    }

    public function relatedTechnologies(): MorphMany
    {
        return $this->relatedMorph(Technology::class);
    }

    public function relatedVideos(): MorphMany
    {
        return $this->relatedMorph(Video::class);
    }

    public function relatedDoctors(): MorphMany
    {
        return $this->relatedMorph(Doctor::class);
    }

    public function relatedBlogPosts(): MorphMany
    {
        return $this->relatedMorph(BlogPost::class);
    }

    public function relatedPress(): MorphMany
    {
        return $this->relatedMorph(PressItem::class);
    }

    public function relatedHospitals(): MorphMany
    {
        return $this->relatedMorph(Hospital::class);
    }
}
