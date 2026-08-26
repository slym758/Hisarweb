<?php

namespace App\Filament\Resources\Sliders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SlidersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('placement')
                    ->label('Yerleşim')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slides_count')
                    ->label('Slayt')
                    ->counts('slides')
                    ->badge(),
                IconColumn::make('autoplay')
                    ->label('Otomatik')
                    ->boolean(),
                TextColumn::make('interval_ms')
                    ->label('Süre (ms)')
                    ->numeric()
                    ->toggleable(),
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
