<?php

namespace App\Filament\Resources\FormSubmissions\Schemas;

use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FormSubmissionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Gönderi')
                    ->schema([
                        TextEntry::make('key')->label('Form'),
                        TextEntry::make('status')->label('Durum')->badge(),
                        TextEntry::make('locale')->label('Dil'),
                        TextEntry::make('created_at')->label('Tarih')->dateTime('d.m.Y H:i'),
                        TextEntry::make('consent_at')->label('KVKK açık rıza')->dateTime('d.m.Y H:i'),
                        TextEntry::make('ip')->label('IP'),
                    ])
                    ->columns(2),

                Section::make('İçerik')
                    ->schema([
                        KeyValueEntry::make('payload')
                            ->label('Gönderilen alanlar')
                            ->keyLabel('Alan')
                            ->valueLabel('Değer')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
