<?php

namespace App\Filament\Resources\Videos\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VideoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('code')
                            ->label('Kod')
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('youtube_id')
                            ->label('YouTube ID')
                            ->required(),
                        TextInput::make('duration')
                            ->label('Süre'),
                        Select::make('department_id')
                            ->label('Bölüm')
                            ->relationship('department', 'slug')
                            ->searchable()
                            ->preload()
                            ->nullable(),
                        FileUpload::make('poster_path')
                            ->label('Poster')
                            ->image()
                            ->disk('public')
                            ->directory('videos'),
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
                    TextInput::make("title.$locale")
                        ->label('Başlık')
                        ->required($isDefault),
                    TextInput::make("category.$locale")
                        ->label('Kategori'),
                ]),
            ]);
    }
}
