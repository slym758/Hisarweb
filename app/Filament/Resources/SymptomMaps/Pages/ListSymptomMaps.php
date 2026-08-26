<?php

namespace App\Filament\Resources\SymptomMaps\Pages;

use App\Filament\Resources\SymptomMaps\SymptomMapResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSymptomMaps extends ListRecords
{
    protected static string $resource = SymptomMapResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
