<?php

namespace App\Filament\Resources\HealthPackages\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\HealthPackages\HealthPackageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHealthPackage extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = HealthPackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
