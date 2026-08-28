<?php

namespace App\Filament\Resources\PressItems\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PressItemForm
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
                        TextInput::make('source')
                            ->label('Kaynak'),
                        DatePicker::make('published_at')
                            ->label('Tarih'),
                        FileUpload::make('cover_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('press'),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("slug_i18n.$locale")
                        ->label('URL (bu dilde, opsiyonel)')
                        ->helperText('Boş bırakılırsa varsayılan slug kullanılır.'),
                    TextInput::make("title.$locale")
                        ->label('Başlık')
                        ->required($isDefault),
                    Textarea::make("excerpt.$locale")
                        ->label('Özet')
                        ->rows(2),
                ]),
            ]);
    }
}
