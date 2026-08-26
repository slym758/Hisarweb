<?php

namespace App\Filament\Resources\SymptomMaps\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\SymptomMaps\SymptomMapResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSymptomMap extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = SymptomMapResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
