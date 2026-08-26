<?php

namespace App\Filament\Resources\EventItems\Pages;

use App\Filament\Resources\EventItems\EventItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEventItems extends ListRecords
{
    protected static string $resource = EventItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
