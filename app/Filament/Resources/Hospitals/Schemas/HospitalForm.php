<?php

namespace App\Filament\Resources\Hospitals\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HospitalForm
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
                        TextInput::make('phone')
                            ->label('Telefon'),
                        TextInput::make('map_query')
                            ->label('Harita sorgusu'),
                        Toggle::make('coming_soon')
                            ->label('Yakında'),
                        FileUpload::make('cover_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('hospitals'),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi'),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("name.$locale")
                        ->label('Ad')
                        ->required($isDefault),
                    TextInput::make("area.$locale")
                        ->label('Bölge/Semt'),
                    Textarea::make("address.$locale")
                        ->label('Adres')
                        ->rows(2),
                    Repeater::make("about.$locale")
                        ->label('Hakkında')
                        ->simple(Textarea::make('value')->rows(2))
                        ->collapsed()
                        ->collapsible(),
                    Repeater::make("features.$locale")
                        ->label('Özellikler')
                        ->schema([
                            TextInput::make('title'),
                            Textarea::make('desc')->rows(2),
                        ])
                        ->collapsed()
                        ->collapsible(),
                    Repeater::make("technologies.$locale")
                        ->label('Teknolojiler')
                        ->schema([
                            TextInput::make('name'),
                            Textarea::make('desc')->rows(2),
                        ])
                        ->collapsed()
                        ->collapsible(),
                    Repeater::make("transport.$locale")
                        ->label('Ulaşım')
                        ->simple(TextInput::make('value'))
                        ->collapsed()
                        ->collapsible(),
                    Textarea::make("emergency.$locale")
                        ->label('Acil')
                        ->rows(2),
                    Textarea::make("working_hours.$locale")
                        ->label('Çalışma saatleri')
                        ->rows(2),
                    Repeater::make("gallery.$locale")
                        ->label('Galeri')
                        ->schema(array_values(array_filter([
                            // Görsel yalnız varsayılan dilde yüklenir/girilir (tüm dillerde ortak).
                            $isDefault
                                ? FileUpload::make('image_path')
                                    ->label('Görsel yükle')
                                    ->image()
                                    ->disk('public')
                                    ->directory('hospital-gallery')
                                : null,
                            $isDefault
                                ? TextInput::make('image')->label('veya Görsel URL')
                                : null,
                            TextInput::make('caption')->label('Açıklama'),
                        ])))
                        ->collapsed()
                        ->collapsible(),
                ]),
            ]);
    }
}
