<?php

namespace App\Filament\Resources\Diseases\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\Diseases\DiseaseResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDisease extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = DiseaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
