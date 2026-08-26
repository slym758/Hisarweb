<?php

namespace App\Filament\Support;

use App\Models\Page;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

/**
 * Bespoke, editor-friendly "page text" sections for the three Integrated Oncology pages.
 * Each section binds to the page's translatable `copy` tree (copy.$locale.<path>) via
 * {@see LocaleTabs}, so what an editor types overrides the inline React COPY (usePageCopy
 * deep-merges the DB copy over it; a cleared field falls back to the inline text). Each
 * section is visible only on its own page (matched by slug). Seeded with the current wording
 * by OncologyCopySeeder so the fields open pre-filled.
 */
class OncologyCopyFields
{
    /** @return array<int, Section> */
    public static function sections(): array
    {
        return [
            self::forSlug('butunlesik-onkoloji', 'Sayfa metinleri — Genel Bakış', fn (string $locale, bool $isDefault) => [
                TextInput::make("copy.$locale.badge")->label('Rozet'),
                TextInput::make("copy.$locale.heroTitle")->label('Hero başlık'),
                Textarea::make("copy.$locale.heroDesc")->label('Hero açıklama')->rows(4),
                TextInput::make("copy.$locale.approachTitle")->label('Yaklaşım başlığı'),
                Textarea::make("copy.$locale.approachDesc")->label('Yaklaşım açıklaması')->rows(4),
                Repeater::make("copy.$locale.units")
                    ->label('Alt birimler')
                    ->simple(TextInput::make('value'))
                    ->collapsed()->collapsible(),
                TextInput::make("copy.$locale.council.title")->label('Konsey başlığı'),
                Textarea::make("copy.$locale.council.desc")->label('Konsey açıklaması')->rows(4),
                TextInput::make("copy.$locale.council.membersLabel")->label('Konsey üye etiketi'),
                Repeater::make("copy.$locale.council.members")
                    ->label('Konsey üyeleri')
                    ->simple(TextInput::make('value'))
                    ->collapsed()->collapsible(),
                Textarea::make("copy.$locale.council.membersNote")->label('Konsey üye notu')->rows(2),
                Repeater::make("copy.$locale.highlights")
                    ->label('Öne çıkanlar')
                    ->schema([
                        TextInput::make('title')->label('Başlık'),
                        Textarea::make('desc')->label('Açıklama')->rows(2),
                    ])
                    ->collapsed()->collapsible(),
                TextInput::make("copy.$locale.numbersTitle")->label('Rakamlar başlığı'),
                TextInput::make("copy.$locale.quickTitle")->label('Hızlı erişim başlığı'),
                TextInput::make("copy.$locale.gallery.eyebrow")->label('Merkez turu — üst etiket'),
                TextInput::make("copy.$locale.gallery.title")->label('Merkez turu — başlık'),
            ]),

            self::forSlug('butunlesik-onkoloji-medikal-kadro', 'Sayfa metinleri — Medikal Kadro', fn (string $locale, bool $isDefault) => [
                TextInput::make("copy.$locale.title")->label('Başlık'),
                Textarea::make("copy.$locale.intro")->label('Giriş metni')->rows(4),
            ]),

            self::forSlug('moral-takimi', 'Sayfa metinleri — Moral Takımı', fn (string $locale, bool $isDefault) => [
                TextInput::make("copy.$locale.heroEyebrow")->label('Hero üst etiket'),
                TextInput::make("copy.$locale.heroTitleTop")->label('Hero başlık (üst)'),
                TextInput::make("copy.$locale.heroTitleBottom")->label('Hero başlık (alt)'),
                Textarea::make("copy.$locale.heroDesc")->label('Hero açıklama')->rows(4),
                TextInput::make("copy.$locale.membersTitle")->label('Üyeler bölüm başlığı'),
                TextInput::make("copy.$locale.visitsTitle")->label('Ziyaretler bölüm başlığı'),
                Textarea::make("copy.$locale.visitsDesc")->label('Ziyaretler açıklaması')->rows(2),
            ]),
        ];
    }

    private static function forSlug(string $slug, string $title, callable $fields): Section
    {
        return Section::make($title)
            ->description('Boş bırakılan alan sitedeki mevcut metni korur. Değiştirmek için yeni halini yazın.')
            ->visible(fn (?Page $record) => $record?->slug === $slug)
            ->collapsible()
            ->schema([
                LocaleTabs::make($fields),
            ]);
    }
}
