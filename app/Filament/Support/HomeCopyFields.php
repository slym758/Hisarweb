<?php

namespace App\Filament\Support;

use App\Models\Page;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;

/**
 * Editor-friendly "home page text" sections for the homepage (slug `home`). Each section binds
 * to the page's translatable `copy` tree (copy.$locale.<path>) via {@see LocaleTabs}, deep-merged
 * over the inline React COPY (usePageCopy); a cleared field falls back to the inline text.
 * Only shown on the home page. The hero slider is managed separately (Slider/Banner resource).
 */
class HomeCopyFields
{
    /** @return array<int, Section> */
    public static function sections(): array
    {
        return [
            self::section('Anasayfa — Hızlı Erişim', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.quick.eyebrow")->label('Üst etiket'),
                TextInput::make("copy.$locale.quick.title")->label('Başlık'),
                TextInput::make("copy.$locale.quick.subtitle")->label('Alt başlık'),
                Repeater::make("copy.$locale.quick.items")
                    ->label('Kartlar')
                    ->schema([
                        TextInput::make('label')->label('Başlık'),
                        Textarea::make('desc')->label('Açıklama')->rows(2),
                        TextInput::make('mobileDesc')->label('Mobil açıklama'),
                        TextInput::make('cta')->label('Buton yazısı'),
                        TextInput::make('to')->label('Bağlantı (URL)')->placeholder('/doktorlarimiz veya https://...'),
                    ])
                    ->collapsed()->collapsible(),
            ]),

            self::section('Anasayfa — Güven / Rakamlar', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.trust.eyebrow")->label('Üst etiket'),
                TextInput::make("copy.$locale.trust.title")->label('Başlık'),
                Textarea::make("copy.$locale.trust.desc")->label('Açıklama')->rows(3),
                Repeater::make("copy.$locale.trust.stats")
                    ->label('Rakamlar')
                    ->schema([
                        TextInput::make('target')->label('Sayı')->numeric(),
                        TextInput::make('suffix')->label('Ek (ör. +, M+)'),
                        TextInput::make('label')->label('Etiket'),
                    ])
                    ->columns(3)
                    ->collapsed()->collapsible(),
            ]),

            self::section('Anasayfa — Bütünleşik Onkoloji', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.onko.badge")->label('Rozet'),
                TextInput::make("copy.$locale.onko.titleLead")->label('Başlık (1)'),
                TextInput::make("copy.$locale.onko.titleAccent")->label('Başlık (vurgu)'),
                TextInput::make("copy.$locale.onko.titleTail")->label('Başlık (son)'),
                Textarea::make("copy.$locale.onko.desc")->label('Açıklama')->rows(3),
                TextInput::make("copy.$locale.onko.youtubeId")
                    ->label('Tanıtım videosu (YouTube ID)')
                    ->placeholder('Örn. EMGGDcEurkg')
                    ->helperText('YouTube linkindeki v= sonrası kod.'),
                Repeater::make("copy.$locale.onko.features")
                    ->label('Özellikler')
                    ->schema([
                        TextInput::make('title')->label('Başlık'),
                        Textarea::make('desc')->label('Açıklama')->rows(2),
                    ])
                    ->collapsed()->collapsible(),
                Repeater::make("copy.$locale.onko.checklist")
                    ->label('Kontrol listesi')
                    ->schema([
                        TextInput::make('label')->label('Madde'),
                        Toggle::make('hide')->label('Gizle (mobilde)'),
                    ])
                    ->collapsed()->collapsible(),
            ]),

            self::section('Anasayfa — Özel Merkezler (başlıklar)', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.merkezler.eyebrow")->label('Üst etiket'),
                TextInput::make("copy.$locale.merkezler.title")->label('Başlık'),
                Textarea::make("copy.$locale.merkezler.subtitle")->label('Alt başlık')->rows(2),
                Repeater::make("copy.$locale.merkezler.items")
                    ->label('Merkez kartları')
                    ->schema([
                        TextInput::make('name')->label('Ad'),
                        Textarea::make('desc')->label('Açıklama')->rows(2),
                        TextInput::make('accent')->label('Etiket (branş)'),
                    ])
                    ->collapsed()->collapsible(),
            ]),

            self::section('Anasayfa — Rehber (blog başlığı)', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.blog.eyebrow")->label('Üst etiket'),
                TextInput::make("copy.$locale.blog.title")->label('Başlık'),
            ]),

            self::section('Anasayfa — Duyuru şeridi', fn (string $locale, bool $d) => [
                Repeater::make("copy.$locale.announce.items")
                    ->label('Duyurular')
                    ->schema([
                        TextInput::make('title')->label('Başlık'),
                        Textarea::make('sub')->label('Alt metin')->rows(2),
                        TextInput::make('cta')->label('Buton yazısı'),
                        TextInput::make('href')->label('Bağlantı (URL)')->placeholder('/mobil-uygulama veya https://...'),
                    ])
                    ->collapsed()->collapsible(),
            ]),

            self::section('Anasayfa — Bölüm bulucu', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.symptom.title")->label('Başlık'),
                TextInput::make("copy.$locale.symptom.subtitle")->label('Alt başlık'),
                TextInput::make("copy.$locale.symptom.placeholder")->label('Arama ipucu'),
                Repeater::make("copy.$locale.symptom.suggestions")
                    ->label('Örnek şikayetler')
                    ->simple(TextInput::make('value'))
                    ->collapsed()->collapsible(),
            ]),

            self::section('Anasayfa — Bölümler (başlık)', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.departments.eyebrow")->label('Üst etiket'),
                TextInput::make("copy.$locale.departments.titleLead")->label('Başlık (1)'),
                TextInput::make("copy.$locale.departments.titleAccent")->label('Başlık (vurgu)'),
                Textarea::make("copy.$locale.departments.desc")->label('Açıklama')->rows(3),
            ]),

            self::section('Anasayfa — Hastaneler (başlık)', fn (string $locale, bool $d) => [
                TextInput::make("copy.$locale.hospitals.eyebrow")->label('Üst etiket'),
                TextInput::make("copy.$locale.hospitals.title")->label('Başlık'),
                Textarea::make("copy.$locale.hospitals.subtitle")->label('Alt başlık')->rows(2),
            ]),
        ];
    }

    private static function section(string $title, callable $fields): Section
    {
        return Section::make($title)
            ->description('Boş bırakılan alan sitedeki mevcut metni korur. Hero slaytları "Slider / Banner" bölümünden yönetilir.')
            ->visible(fn (?Page $record) => $record?->slug === 'home')
            ->collapsed()
            ->collapsible()
            ->schema([
                LocaleTabs::make($fields),
            ]);
    }
}
