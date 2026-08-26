<?php

namespace App\Filament\Resources\FormDefinitions\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FormDefinitionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('key')
                            ->label('Anahtar (key)')
                            ->helperText('Formun kimliği; frontend bu değerle POST eder. Oluşturduktan sonra değiştirmeyin.')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->disabled(fn (string $operation) => $operation === 'edit')
                            ->dehydrated(),
                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                        TagsInput::make('recipients')
                            ->label('Alıcı e-postalar')
                            ->helperText('Enter ile ekleyin. Gönderimler bu adreslere iletilir.')
                            ->placeholder('ornek@hisarhospital.com')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("title.$locale")
                        ->label('Başlık')
                        ->required($isDefault),
                    TagsInput::make("subjects.$locale")
                        ->label('Konu seçenekleri')
                        ->helperText('İsteğe bağlı; konu açılır menüsü için.'),
                    Textarea::make("kvkk_text.$locale")
                        ->label('KVKK açık rıza metni')
                        ->rows(4),
                    Textarea::make("success_message.$locale")
                        ->label('Başarı mesajı')
                        ->rows(2),
                    Textarea::make("error_message.$locale")
                        ->label('Hata mesajı')
                        ->rows(2),
                ]),
            ]);
    }
}
