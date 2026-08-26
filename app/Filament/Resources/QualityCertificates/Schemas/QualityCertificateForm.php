<?php

namespace App\Filament\Resources\QualityCertificates\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QualityCertificateForm
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
                        Select::make('hospital_id')
                            ->label('Hastane')
                            ->relationship('hospital', 'slug')
                            ->searchable()
                            ->preload()
                            ->nullable(),
                        DatePicker::make('issued_at')
                            ->label('Veriliş'),
                        DatePicker::make('valid_until')
                            ->label('Geçerlilik'),
                        FileUpload::make('logo_path')
                            ->label('Logo')
                            ->image()
                            ->disk('public')
                            ->directory('certificates'),
                        FileUpload::make('cover_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('certificates'),
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
                    TextInput::make("issuer.$locale")
                        ->label('Veren kurum'),
                ]),
            ]);
    }
}
