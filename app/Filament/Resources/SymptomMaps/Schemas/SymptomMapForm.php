<?php

namespace App\Filament\Resources\SymptomMaps\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SymptomMapForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        Select::make('department_id')
                            ->label('Bölüm')
                            ->relationship('department', 'slug')
                            ->searchable()
                            ->preload()
                            ->required(),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("label.$locale")
                        ->label('Etiket')
                        ->required($isDefault),
                    Repeater::make("keywords.$locale")
                        ->label('Anahtar kelimeler')
                        ->simple(TextInput::make('value'))
                        ->collapsed()
                        ->collapsible(),
                ]),
            ]);
    }
}
