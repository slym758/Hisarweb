<?php

namespace App\Filament\Resources\MoralTeamMembers\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MoralTeamMemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('name')
                            ->label('Ad Soyad')
                            ->required(),
                        FileUpload::make('photo_path')
                            ->label('Portre fotoğrafı')
                            ->image()
                            ->disk('public')
                            ->directory('moral-takimi'),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi'),
                        FileUpload::make('gallery')
                            ->label('Ziyaret fotoğrafları')
                            ->helperText('Bu isme ait ziyaret galerisi (isteğe bağlı, çoklu).')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->disk('public')
                            ->directory('moral-takimi-ziyaret')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("role.$locale")
                        ->label('Rol / Ünvan')
                        ->placeholder('Örn. Oyuncu, Sporcu, Sunucu')
                        ->required($isDefault),
                ]),
            ]);
    }
}
