<?php

namespace App\Filament\Resources\Languages\Schemas;

use App\Models\Language;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LanguageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Dil')
                    ->columns(2)
                    ->schema([
                        TextInput::make('code')
                            ->label('Kod')
                            ->helperText('ISO kodu, ör. tr, en, ar, de.')
                            ->required()
                            ->maxLength(10)
                            ->unique(ignoreRecord: true),
                        TextInput::make('name')
                            ->label('Ad (yönetim)')
                            ->required(),
                        TextInput::make('native_name')
                            ->label('Yerel ad')
                            ->helperText('Dilin kendi yazımı, ör. Türkçe, English, العربية.')
                            ->required(),
                        Select::make('fallback_code')
                            ->label('Yedek dil (çeviri yoksa)')
                            ->helperText('Bu dilde çeviri bulunmazsa hangi dile düşülecek.')
                            ->options(fn (?Language $record) => Language::query()
                                ->when($record, fn ($q) => $q->whereKeyNot($record->getKey()))
                                ->orderBy('sort_order')
                                ->pluck('name', 'code'))
                            ->searchable()
                            ->nullable(),
                        Toggle::make('is_default')
                            ->label('Varsayılan (kök dil, /önek yok)')
                            ->helperText('Yalnızca bir dil varsayılan olabilir.'),
                        Toggle::make('is_rtl')
                            ->label('Sağdan sola (RTL)'),
                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                        TextInput::make('sort_order')
                            ->label('Sıra')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }
}
