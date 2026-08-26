<?php

namespace App\Filament\Resources\Menus\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MenusTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('location')
                    ->label('Konum')
                    ->badge(),
                TextColumn::make('label')
                    ->label('Ad'),
                TextColumn::make('items_count')
                    ->label('Öğe sayısı')
                    ->counts('items'),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
