<?php

namespace App\Filament\Resources\HealthPackages\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HealthPackageForm
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
                        FileUpload::make('cover_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('packages'),
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
                    TextInput::make("slug_i18n.$locale")
                        ->label('URL (bu dilde, opsiyonel)')
                        ->helperText('Boş bırakılırsa varsayılan slug kullanılır.'),
                    TextInput::make("name.$locale")
                        ->label('Ad')
                        ->required($isDefault),
                    Textarea::make("summary.$locale")
                        ->label('Özet')
                        ->rows(2),
                    Repeater::make("scope.$locale")
                        ->label('Kapsam')
                        ->simple(Textarea::make('value')->rows(2))
                        ->collapsed()
                        ->collapsible(),
                ]),
            ]);
    }
}
