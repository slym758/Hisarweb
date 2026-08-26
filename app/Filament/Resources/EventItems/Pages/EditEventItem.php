<?php

namespace App\Filament\Resources\EventItems\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\EventItems\EventItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditEventItem extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = EventItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
