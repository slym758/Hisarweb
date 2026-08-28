<?php

namespace App\Filament\Resources\Diseases\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Filament\Support\RelatedContent;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DiseaseForm
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
                        Select::make('department_id')
                            ->label('Bölüm')
                            ->relationship('department', 'slug')
                            ->searchable()
                            ->preload()
                            ->required(),
                        FileUpload::make('cover_path')
                            ->label('Kapak')
                            ->image()
                            ->disk('public')
                            ->directory('diseases'),
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
                    Section::make('Detay')
                        ->schema([
                            Textarea::make("detail.$locale.what")
                                ->label('Nedir')
                                ->rows(3),
                            Repeater::make("detail.$locale.symptoms")
                                ->label('Belirtiler')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.causes")
                                ->label('Nedenler')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.diagnosis")
                                ->label('Tanı yöntemleri')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.treatment")
                                ->label('Tedavi yöntemleri')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.risks")
                                ->label('Riskler')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.whenToDoctor")
                                ->label('Ne zaman doktora')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.technologies")
                                ->label('İlgili teknolojiler')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.diagnosisDetail")
                                ->label('Tanı (detaylı)')
                                ->schema([
                                    TextInput::make('name')->label('Ad'),
                                    Textarea::make('desc')->label('Açıklama')->rows(2),
                                ])
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.treatments")
                                ->label('Tedaviler (detaylı)')
                                ->schema([
                                    TextInput::make('name')->label('Ad'),
                                    Textarea::make('desc')->label('Açıklama')->rows(2),
                                ])
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.faqs")
                                ->label('SSS')
                                ->schema([
                                    TextInput::make('q')->label('Soru'),
                                    Textarea::make('a')->label('Cevap')->rows(2),
                                ])
                                ->collapsed()
                                ->collapsible(),
                            Textarea::make("detail.$locale.warning")
                                ->label('Uyarı')
                                ->rows(2),
                            Textarea::make("detail.$locale.midCta")
                                ->label('Ara CTA metni')
                                ->rows(2),
                        ])
                        ->collapsed()
                        ->collapsible(),
                ]),

                RelatedContent::section(['treatments', 'technologies', 'doctors', 'blogPosts']),
            ]);
    }
}
