<?php

namespace App\Filament\Resources\FormSubmissions\Tables;

use App\Models\FormSubmission;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FormSubmissionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('key')
                    ->label('Form')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->label('Ad')
                    ->getStateUsing(fn (FormSubmission $r) => $r->payload['name'] ?? $r->payload['fullName'] ?? '—'),
                TextColumn::make('email')
                    ->label('E-posta')
                    ->getStateUsing(fn (FormSubmission $r) => $r->payload['email'] ?? '—'),
                TextColumn::make('status')
                    ->label('Durum')
                    ->badge()
                    ->color(fn (string $state) => $state === 'new' ? 'warning' : 'gray'),
                TextColumn::make('created_at')
                    ->label('Tarih')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([])
            ->recordActions([
                ViewAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
