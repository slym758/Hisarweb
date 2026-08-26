<?php

namespace App\Filament\Support;

use App\Models\Page;
use App\Support\LocaleService;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Illuminate\Support\Str;

/**
 * Generic, record-driven "page text" editor. For any editable {@see Page} it reads the page's
 * `copy` tree (seeded from the inline React COPY) and generates matching form fields per locale,
 * bound to copy.$locale.<path> — so every static page becomes editable in admin without a
 * bespoke form. Pages that already have a hand-built editor (home, oncology) are skipped.
 *
 * A cleared field falls back to the inline COPY (usePageCopy deep-merge), so edits are safe.
 */
class AutoPageCopyFields
{
    /** Slugs that have a nicer bespoke editor already (see Home/OncologyCopyFields). */
    private const BESPOKE = [
        'home',
        'butunlesik-onkoloji',
        'butunlesik-onkoloji-medikal-kadro',
        'moral-takimi',
    ];

    /** The single dynamic section added to the Pages form. */
    public static function section(): Section
    {
        return Section::make('Sayfa metinleri')
            ->description('Bu sayfadaki tüm metinler. Boş bırakılan alan sitedeki mevcut metni korur.')
            ->collapsible()
            ->visible(fn (?Page $record) => $record
                && ! in_array($record->slug, self::BESPOKE, true)
                && ! empty(array_filter($record->getTranslations('copy'))))
            ->schema(fn (?Page $record) => self::build($record));
    }

    /** @return array<int, mixed> */
    private static function build(?Page $record): array
    {
        if (! $record) {
            return [];
        }

        $template = $record->getTranslation('copy', LocaleService::default(), false);

        if (! is_array($template) || empty($template)) {
            return [];
        }

        return [
            LocaleTabs::make(fn (string $locale) => self::fields($template, "copy.{$locale}")),
        ];
    }

    /**
     * Recursively turn a copy sub-tree into form fields. $prefix is the dot-path fields bind to
     * ('' inside a repeater item, where names are relative to the item).
     *
     * @param  array<string, mixed>  $tree
     * @return array<int, mixed>
     */
    private static function fields(array $tree, string $prefix): array
    {
        $out = [];

        foreach ($tree as $key => $value) {
            $path = $prefix === '' ? (string) $key : "{$prefix}.{$key}";
            $label = Str::headline((string) $key);

            if (is_bool($value)) {
                $out[] = Toggle::make($path)->label($label);
            } elseif (is_int($value) || is_float($value)) {
                $out[] = TextInput::make($path)->label($label)->numeric();
            } elseif (is_string($value)) {
                $out[] = mb_strlen($value) > 70
                    ? Textarea::make($path)->label($label)->rows(2)
                    : TextInput::make($path)->label($label);
            } elseif (is_array($value)) {
                $out[] = self::arrayField($value, $path, $label);
            }
        }

        return $out;
    }

    private static function arrayField(array $value, string $path, string $label): mixed
    {
        // Associative object → a nested, compact section that recurses.
        if (! array_is_list($value)) {
            return Section::make($label)
                ->schema(self::fields($value, $path))
                ->collapsed()
                ->collapsible();
        }

        // List of scalars → a simple repeater of single values.
        $firstObject = collect($value)->first(fn ($v) => is_array($v));
        if ($firstObject === null) {
            return Repeater::make($path)
                ->label($label)
                ->simple(TextInput::make('value'))
                ->collapsed()
                ->collapsible();
        }

        // List of objects → a repeater whose item schema mirrors the first object.
        return Repeater::make($path)
            ->label($label)
            ->schema(self::fields($firstObject, ''))
            ->collapsed()
            ->collapsible();
    }
}
