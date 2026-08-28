<?php

namespace App\Models;

use App\Models\Concerns\HasRelatedContent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Doctor extends ContentModel
{
    use HasRelatedContent;

    public array $translatable = ['name', 'title', 'bio', 'subspecialties', 'languages', 'cv', 'appointment_note'];

    /** Public route key stays `code` (d1…) so existing /doktor/{id} URLs are unchanged. */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** Primary hospital (kept for backward-compat + as the first/fallback). */
    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }

    /** All hospitals this doctor practises at, in editor order (position). */
    public function hospitals(): BelongsToMany
    {
        return $this->belongsToMany(Hospital::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }
}
