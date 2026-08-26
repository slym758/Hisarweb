<?php

namespace App\Filament\Resources\HomeCenters\Pages;

use App\Filament\Resources\HomeCenters\HomeCenterResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHomeCenters extends ListRecords
{
    protected static string $resource = HomeCenterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
