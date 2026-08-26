<?php

namespace App\Filament\Resources\FormDefinitions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FormDefinitionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Anahtar')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('title')
                    ->label('Başlık')
                    ->searchable(),
                TextColumn::make('recipients')
                    ->label('Alıcılar')
                    ->badge()
                    ->separator(','),
                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
