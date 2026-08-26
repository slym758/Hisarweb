<?php

namespace App\Filament\Resources\PressItems\Pages;

use App\Filament\Resources\PressItems\PressItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPressItems extends ListRecords
{
    protected static string $resource = PressItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
