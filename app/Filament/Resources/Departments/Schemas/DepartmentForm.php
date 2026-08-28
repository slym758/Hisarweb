<?php

namespace App\Filament\Resources\Departments\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Filament\Support\RelatedContent;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DepartmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('slug')
                            ->label('Slug (URL)')
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('icon')
                            ->label('İkon adı (Lucide)')
                            ->helperText('Örn. HeartPulse. Aşağıdan görsel yüklersen o kullanılır.'),
                        FileUpload::make('icon_path')
                            ->label('İkon görseli (yüklersen ad yerine bu kullanılır)')
                            ->image()
                            ->disk('public')
                            ->directory('dept-icons')
                            ->acceptedFileTypes(['image/svg+xml', 'image/png', 'image/webp', 'image/jpeg']),
                        TextInput::make('cover_url')
                            ->label('Kapak görseli (URL)')
                            ->url(),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                        Toggle::make('pinned')
                            ->label('Öne çıkar (ana sayfa)'),
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi'),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("slug_i18n.$locale")
                        ->label('URL (bu dilde, opsiyonel)')
                        ->helperText('Boş bırakılırsa varsayılan slug kullanılır.'),
                    TextInput::make("name.$locale")
                        ->label('Ad')
                        ->required($isDefault),
                    Textarea::make("blurb.$locale")
                        ->label('Kısa açıklama')
                        ->rows(2),
                    Repeater::make("about.$locale")
                        ->label('Hakkında (paragraflar)')
                        ->simple(Textarea::make('paragraph')->rows(2))
                        ->collapsed()
                        ->collapsible(),
                    Repeater::make("technologies.$locale")
                        ->label('Öne çıkan teknolojiler')
                        ->schema(array_values(array_filter([
                            TextInput::make('name')->label('Ad'),
                            Textarea::make('desc')->label('Açıklama')->rows(2),
                            // Görsel yalnız varsayılan dilde yüklenir (tüm dillerde ortak kullanılır).
                            $isDefault
                                ? FileUpload::make('image')
                                    ->label('Görsel')
                                    ->image()
                                    ->disk('public')
                                    ->directory('dept-tech')
                                : null,
                        ])))
                        ->collapsed()
                        ->collapsible(),
                ]),

                // Manuel içerik ilişkileri: boş bırakılırsa bölüme göre otomatik gelir.
                RelatedContent::section(['doctors', 'diseases', 'treatments', 'technologies', 'videos', 'blogPosts']),
            ]);
    }
}
