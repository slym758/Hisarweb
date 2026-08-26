<?php

namespace App\Filament\Resources\HomeCenters\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HomeCenterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Görsel')
                            ->image()
                            ->disk('public')
                            ->directory('home-centers'),
                        TextInput::make('image_url')
                            ->label('veya Görsel URL')
                            ->helperText('Yükleme yoksa bu adres kullanılır.'),
                        TextInput::make('link')
                            ->label('Bağlantı (URL)')
                            ->placeholder('/tedavi-yontemleri veya /bolum/kardiyoloji')
                            ->helperText('Kart tıklanınca gidilecek sayfa.'),
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
                    TextInput::make("accent.$locale")
                        ->label('Etiket (branş)'),
                    Textarea::make("desc.$locale")
                        ->label('Açıklama')
                        ->rows(2),
                ]),
            ]);
    }
}
