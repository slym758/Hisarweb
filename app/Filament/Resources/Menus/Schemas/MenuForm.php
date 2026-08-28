<?php

namespace App\Filament\Resources\Menus\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Models\Menu;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Editing form for a {@see Menu}. The item tree is edited with nested
 * relationship Repeaters (header: group → column → leaf). Translatable label/badge are
 * edited per-locale via {@see LocaleTabs}; because spatie stores them as a JSON map, they
 * are decoded on fill so the tabs populate (saving writes the map straight back).
 */
class MenuForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Menü')
                ->columns(2)
                ->schema([
                    TextInput::make('location')->label('Konum')->disabled(),
                    TextInput::make('label')->label('Ad (yönetim içi)'),
                ]),

            Repeater::make('topItems')
                ->relationship()
                ->label('Menü öğeleri')
                ->addActionLabel('Öğe ekle')
                ->collapsible()
                ->collapsed()
                ->orderColumn('sort_order')
                ->itemLabel(fn (array $state): ?string => self::itemLabel($state))
                ->mutateRelationshipDataBeforeFillUsing(fn (array $data): array => self::decode($data))
                ->schema([
                    ...self::itemFields(),

                    Repeater::make('children')
                        ->relationship()
                        ->label('Alt öğeler / mega menü sütunları')
                        ->addActionLabel('Sütun / öğe ekle')
                        ->collapsible()
                        ->collapsed()
                        ->orderColumn('sort_order')
                        ->itemLabel(fn (array $state): ?string => self::itemLabel($state))
                        ->mutateRelationshipDataBeforeFillUsing(fn (array $data): array => self::decode($data))
                        ->schema([
                            ...self::itemFields(),

                            Repeater::make('children')
                                ->relationship()
                                ->label('Bağlantılar')
                                ->addActionLabel('Bağlantı ekle')
                                ->collapsible()
                                ->collapsed()
                                ->orderColumn('sort_order')
                                ->itemLabel(fn (array $state): ?string => self::itemLabel($state))
                                ->mutateRelationshipDataBeforeFillUsing(fn (array $data): array => self::decode($data))
                                ->schema(self::itemFields()),
                        ]),
                ]),
        ]);
    }

    /**
     * The field set for a single menu item, reused at every nesting level.
     *
     * @return array<int, mixed>
     */
    private static function itemFields(): array
    {
        return [
            LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                TextInput::make("label.$locale")
                    ->label('Etiket')
                    ->required($isDefault),
            ]),
            Select::make('link_type')
                ->label('Bağlantı tipi')
                ->options([
                    'internal' => 'İç sayfa (route)',
                    'external' => 'Dış bağlantı (URL)',
                    'none' => 'Başlık — bağlantısız',
                ])
                ->default('internal')
                ->required(),
            TextInput::make('route')
                ->label('İç yol')
                ->placeholder('/bolumlerimiz')
                ->helperText('Bağlantı tipi "İç sayfa" ise kullanılır.'),
            TextInput::make('url')
                ->label('Dış bağlantı (URL)')
                ->placeholder('https://…')
                ->helperText('Bağlantı tipi "Dış bağlantı" ise kullanılır.'),
            Toggle::make('column_group')
                ->label('Mega menü sütun başlığı'),
            LocaleTabs::make(fn (string $locale) => [
                TextInput::make("badge.$locale")
                    ->label('Rozet')
                    ->placeholder('Yakında'),
            ]),
            TagsInput::make('matches')
                ->label('Aktiflik yolları (matches)')
                ->placeholder('/kurumsal')
                ->helperText('Bu öğenin aktif sayılacağı yollar (üst düzey gruplar için).'),
            Select::make('page_types')
                ->label('Sayfa türleri (mobil alt menü)')
                ->helperText('Yalnızca mobil alt menüde etkili. Boş = tüm sayfalarda. Seçilirse sadece bu sayfa türlerinde görünür.')
                ->options([
                    'home' => 'Anasayfa',
                    'detail' => 'Detay sayfaları',
                    'other' => 'Diğer sayfalar',
                ])
                ->multiple(),
            Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
        ];
    }

    /** Decode spatie's JSON label/badge maps so the LocaleTabs fields populate on fill. */
    private static function decode(array $data): array
    {
        foreach (['label', 'badge'] as $attr) {
            if (isset($data[$attr]) && is_string($data[$attr])) {
                $decoded = json_decode($data[$attr], true);
                $data[$attr] = is_array($decoded) ? $decoded : [];
            }
        }

        return $data;
    }

    /** A readable collapsed-item title from the (decoded) label map. */
    private static function itemLabel(array $state): ?string
    {
        $label = $state['label'] ?? null;

        if (is_array($label)) {
            $value = $label['tr'] ?? $label['en'] ?? reset($label);

            return is_string($value) && $value !== '' ? $value : null;
        }

        return is_string($label) && $label !== '' ? $label : null;
    }
}
