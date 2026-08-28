<?php

namespace App\Filament\Resources\Sliders\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Models\Slider;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Editing form for a {@see Slider}. The slides are edited with a reorderable
 * relationship Repeater (drag to set `sort_order`). Image uploads store a public-disk path
 * (`*_path`); the URL fields stay as fallback. Translatable slide copy is edited per-locale
 * via {@see LocaleTabs}; because spatie stores those as a JSON map, they are decoded on fill
 * so the tabs populate (saving writes the map straight back).
 */
class SliderForm
{
    /** Translatable slide attributes stored as spatie {tr,en,…} JSON maps. */
    private const TRANSLATABLE = [
        'eyebrow', 'title', 'mobile_title', 'desc', 'mobile_desc',
        'image_path', 'image_url', 'mobile_image_path', 'mobile_image_url',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Slider')
                ->columns(2)
                ->schema([
                    TextInput::make('placement')
                        ->label('Yerleşim')
                        ->required()
                        ->default('home_hero')
                        ->helperText('Örn. home_hero (ana sayfa hero alanı).'),
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                    Toggle::make('autoplay')
                        ->label('Otomatik oynat')
                        ->default(true),
                    TextInput::make('interval_ms')
                        ->label('Geçiş süresi (ms)')
                        ->numeric()
                        ->minValue(500)
                        ->default(3000)
                        ->required(),
                ]),

            Repeater::make('slides')
                ->relationship()
                ->label('Slaytlar')
                ->addActionLabel('Slayt ekle')
                ->collapsible()
                ->collapsed()
                ->orderColumn('sort_order')
                ->itemLabel(fn (array $state): ?string => self::itemLabel($state))
                ->mutateRelationshipDataBeforeFillUsing(fn (array $data): array => self::decode($data))
                ->schema([
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),

                    Section::make('Görsel (dile göre)')
                        ->description('Her dil için ayrı banner yükleyebilirsiniz. Boş bırakılan dil, varsayılan dilin görselini kullanır.')
                        ->schema([
                            LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                                FileUpload::make("image_path.$locale")
                                    ->label('Görsel (masaüstü)')
                                    ->image()
                                    ->disk('public')
                                    ->directory('slides'),
                                TextInput::make("image_url.$locale")
                                    ->label('Görsel URL (masaüstü)')
                                    ->helperText('Yükleme yoksa bu adres kullanılır.'),
                                FileUpload::make("mobile_image_path.$locale")
                                    ->label('Görsel (mobil)')
                                    ->image()
                                    ->disk('public')
                                    ->directory('slides'),
                                TextInput::make("mobile_image_url.$locale")
                                    ->label('Görsel URL (mobil)'),
                            ]),
                            TextInput::make('position')
                                ->label('Konum (masaüstü)')
                                ->placeholder('50% 50%')
                                ->helperText('CSS object-position.'),
                            TextInput::make('mobile_position')
                                ->label('Konum (mobil)')
                                ->placeholder('50% 50%'),
                        ]),

                    TextInput::make('link')
                        ->label('Bağlantı')
                        ->placeholder('/kurumsal'),

                    LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                        TextInput::make("eyebrow.$locale")
                            ->label('Üst başlık'),
                        TextInput::make("title.$locale")
                            ->label('Başlık')
                            ->required($isDefault),
                        TextInput::make("mobile_title.$locale")
                            ->label('Başlık (mobil)'),
                        Textarea::make("desc.$locale")
                            ->label('Açıklama')
                            ->rows(2),
                        Textarea::make("mobile_desc.$locale")
                            ->label('Açıklama (mobil)')
                            ->rows(2),
                    ]),
                ]),
        ]);
    }

    /** Decode spatie's JSON copy maps so the LocaleTabs fields populate on fill. */
    private static function decode(array $data): array
    {
        foreach (self::TRANSLATABLE as $attr) {
            if (isset($data[$attr]) && is_string($data[$attr])) {
                $decoded = json_decode($data[$attr], true);
                $data[$attr] = is_array($decoded) ? $decoded : [];
            }
        }

        return $data;
    }

    /** A readable collapsed-item title from the (decoded) title map. */
    private static function itemLabel(array $state): ?string
    {
        $title = $state['title'] ?? null;

        if (is_array($title)) {
            $value = $title['tr'] ?? $title['en'] ?? reset($title);

            return is_string($value) && $value !== '' ? $value : null;
        }

        return is_string($title) && $title !== '' ? $title : null;
    }
}
