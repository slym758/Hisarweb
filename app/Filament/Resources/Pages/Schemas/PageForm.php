<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Filament\Support\OncologyCopyFields;
use App\Models\Page;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Editing form for an editable {@see Page}. The page's own translatable fields
 * (admin label + SEO) are edited per-locale via {@see LocaleTabs}; the body copy is edited
 * with a reorderable `contents` relationship Repeater (drag to set `sort_order`). Because
 * spatie stores the translatable `value` as a JSON map, it is decoded on fill so the tabs
 * populate (saving writes the map straight back).
 */
class PageForm
{
    /** Block types an editor can pick for a content block. */
    private const TYPES = [
        'text' => 'Metin',
        'richtext' => 'Zengin metin',
        'list' => 'Liste',
        'link' => 'Bağlantı',
        'image' => 'Görsel',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Genel')
                ->columns(2)
                ->schema([
                    TextInput::make('slug')
                        ->label('Slug (rota anahtarı)')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->helperText('Sayfanın rota anahtarı, örn. kurumsal, vizyon-misyon.'),
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                    LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                        TextInput::make("title.$locale")
                            ->label('Başlık (yönetim etiketi)')
                            ->required($isDefault),
                    ]),
                ]),

            Section::make('SEO')
                ->columns(2)
                ->schema([
                    LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                        TextInput::make("seo_title.$locale")
                            ->label('SEO başlığı'),
                        Textarea::make("seo_description.$locale")
                            ->label('SEO açıklaması')
                            ->rows(3),
                    ]),
                    FileUpload::make('og_image_path')
                        ->label('OG görseli')
                        ->image()
                        ->disk('public')
                        ->directory('pages'),
                    TextInput::make('og_image_url')
                        ->label('OG görseli URL')
                        ->url()
                        ->helperText('Yükleme yoksa bu adres kullanılır.'),
                ]),

            Section::make('İçerik blokları')
                ->schema([
                    Repeater::make('contents')
                        ->relationship()
                        ->label('Bloklar')
                        ->addActionLabel('Blok ekle')
                        ->collapsible()
                        ->collapsed()
                        ->orderColumn('sort_order')
                        ->itemLabel(fn (array $state): ?string => self::itemLabel($state))
                        ->mutateRelationshipDataBeforeFillUsing(fn (array $data): array => self::decode($data))
                        ->columns(3)
                        ->schema([
                            TextInput::make('section')
                                ->label('Bölüm')
                                ->required()
                                ->helperText('Örn. about, vision.'),
                            TextInput::make('key')
                                ->label('Anahtar')
                                ->required()
                                ->helperText('Örn. title, body.'),
                            Select::make('type')
                                ->label('Tür')
                                ->options(self::TYPES)
                                ->default('text')
                                ->required(),
                            LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                                Textarea::make("value.$locale")
                                    ->label('Değer')
                                    ->rows(3),
                            ]),
                        ]),
                ]),

            // Bespoke, editor-friendly text sections for the Integrated Oncology pages
            // (visible only on their own page; write to the page's `copy` tree).
            ...OncologyCopyFields::sections(),
        ]);
    }

    /** Decode spatie's JSON value map so the LocaleTabs fields populate on fill. */
    private static function decode(array $data): array
    {
        if (isset($data['value']) && is_string($data['value'])) {
            $decoded = json_decode($data['value'], true);
            $data['value'] = is_array($decoded) ? $decoded : ['tr' => $data['value']];
        }

        return $data;
    }

    /** A readable collapsed-item title, e.g. "about · title". */
    private static function itemLabel(array $state): ?string
    {
        $section = $state['section'] ?? null;
        $key = $state['key'] ?? null;

        if (is_string($section) && is_string($key) && $section !== '' && $key !== '') {
            return "{$section} · {$key}";
        }

        return is_string($key) && $key !== '' ? $key : null;
    }
}
