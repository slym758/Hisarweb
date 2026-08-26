<?php

namespace App\Filament\Resources\HealthPackages\Pages;

use App\Filament\Resources\HealthPackages\HealthPackageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHealthPackages extends ListRecords
{
    protected static string $resource = HealthPackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
