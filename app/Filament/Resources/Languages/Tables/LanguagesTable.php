<?php

namespace App\Filament\Resources\Languages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LanguagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('code')->label('Kod')->searchable()->sortable(),
                TextColumn::make('name')->label('Ad')->searchable(),
                TextColumn::make('native_name')->label('Yerel ad'),
                TextColumn::make('fallback_code')->label('Yedek')->badge(),
                IconColumn::make('is_default')->label('Varsayılan')->boolean(),
                IconColumn::make('is_rtl')->label('RTL')->boolean(),
                IconColumn::make('is_active')->label('Aktif')->boolean(),
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
