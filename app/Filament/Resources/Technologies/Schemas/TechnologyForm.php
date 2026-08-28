<?php

namespace App\Filament\Resources\Technologies\Schemas;

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

class TechnologyForm
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
                            ->label('Kapak')
                            ->image()
                            ->disk('public')
                            ->directory('technologies'),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi'),
                        Repeater::make('dept_slugs')
                            ->label('Bölüm slugları')
                            ->simple(TextInput::make('value'))
                            ->collapsed()
                            ->collapsible(),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("slug_i18n.$locale")
                        ->label('URL (bu dilde, opsiyonel)')
                        ->helperText('Boş bırakılırsa varsayılan slug kullanılır.'),
                    TextInput::make("name.$locale")
                        ->label('Ad')
                        ->required($isDefault),
                    Textarea::make("description.$locale")
                        ->label('Açıklama')
                        ->rows(2),
                    Section::make('Detay')
                        ->schema([
                            Textarea::make("detail.$locale.what")
                                ->label('Nedir')
                                ->rows(3),
                            Textarea::make("detail.$locale.how")
                                ->label('Nasıl çalışır')
                                ->rows(3),
                            Repeater::make("detail.$locale.advantages")
                                ->label('Avantajlar')
                                ->simple(Textarea::make('value')->rows(2))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.diseaseSlugs")
                                ->label('İlgili hastalık slugları')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("detail.$locale.treatmentSlugs")
                                ->label('İlgili tedavi slugları')
                                ->simple(TextInput::make('value'))
                                ->collapsed()
                                ->collapsible(),
                        ])
                        ->collapsed()
                        ->collapsible(),
                ]),

                RelatedContent::section(['diseases', 'treatments']),
            ]);
    }
}
