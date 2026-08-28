<?php

namespace App\Filament\Support;

use App\Models\BlogPost;
use App\Models\Concerns\HasRelatedContent;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\PressItem;
use App\Models\Technology;
use App\Models\Treatment;
use App\Models\Video;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;

/**
 * Builds the "İlgili İçerikler" (related content) editor section for a content resource.
 *
 * Each block is a Repeater bound to a scoped morph relation on the source model
 * ({@see HasRelatedContent}) — a searchable Select of the target plus
 * drag ordering. Rows are written to `related_items`; leaving a block empty makes the
 * detail page fall back to automatic same-department results (see AutoRelatedResolver).
 *
 * Usage: RelatedContent::section(['treatments', 'diseases', 'technologies', 'videos'])
 */
class RelatedContent
{
    /** relation-method / target model / option-label attribute, per block key. */
    private const BLOCKS = [
        'treatments' => ['relatedTreatments', Treatment::class, 'name', 'Tedaviler'],
        'diseases' => ['relatedDiseases', Disease::class, 'name', 'Hastalıklar'],
        'technologies' => ['relatedTechnologies', Technology::class, 'name', 'Teknolojiler'],
        'videos' => ['relatedVideos', Video::class, 'title', 'Videolar'],
        'doctors' => ['relatedDoctors', Doctor::class, 'name', 'Doktorlar'],
        'blogPosts' => ['relatedBlogPosts', BlogPost::class, 'title', 'Sağlık Rehberi'],
        'press' => ['relatedPress', PressItem::class, 'title', 'Basın'],
        'hospitals' => ['relatedHospitals', Hospital::class, 'name', 'Hastaneler'],
    ];

    /** @var array<class-string, array<int|string, string>> */
    private static array $optionCache = [];

    /**
     * @param  array<int, string>  $blocks  keys among: treatments, diseases, technologies, videos, doctors
     */
    public static function section(array $blocks): Section
    {
        return Section::make('İlgili İçerikler')
            ->description('Boş bırakılırsa aynı bölümden otomatik gelir (bölüme göre AUTO). Seçim yaparsanız MANUEL sıralama geçerli olur.')
            ->schema(array_values(array_filter(array_map(
                fn (string $key) => self::block($key),
                $blocks,
            ))))
            ->collapsed()
            ->collapsible()
            ->columnSpanFull();
    }

    private static function block(string $key): ?Repeater
    {
        if (! isset(self::BLOCKS[$key])) {
            return null;
        }

        [$relation, $model, $labelAttr, $label] = self::BLOCKS[$key];

        return Repeater::make($relation)
            ->relationship()
            ->label($label)
            ->schema([
                Hidden::make('target_type')->default($model),
                Hidden::make('relation')->default('related'),
                Select::make('target_id')
                    ->label($label)
                    ->options(fn () => self::options($model, $labelAttr))
                    ->searchable()
                    ->required(),
            ])
            ->orderColumn('position')
            ->reorderable()
            ->collapsed()
            ->collapsible()
            ->itemLabel(fn (array $state): ?string => self::options($model, $labelAttr)[$state['target_id'] ?? null] ?? null)
            ->addActionLabel($label.' ekle');
    }

    /**
     * id => localized label map for a target model (cached per request).
     *
     * @param  class-string  $model
     * @return array<int|string, string>
     */
    private static function options(string $model, string $labelAttr): array
    {
        if (isset(self::$optionCache[$model])) {
            return self::$optionCache[$model];
        }

        $records = $model::query()->ordered()->get();

        $map = [];
        foreach ($records as $record) {
            // Translatable attributes resolve via loc(); plain columns (e.g. Doctor.name) are read directly.
            $label = in_array($labelAttr, $record->translatable ?? [], true)
                ? $record->loc($labelAttr)
                : $record->{$labelAttr};
            $map[$record->getKey()] = (string) ($label ?? $record->getKey());
        }

        return self::$optionCache[$model] = $map;
    }
}
