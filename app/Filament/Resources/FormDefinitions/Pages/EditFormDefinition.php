<?php

namespace App\Filament\Resources\FormDefinitions\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\FormDefinitions\FormDefinitionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFormDefinition extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = FormDefinitionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
