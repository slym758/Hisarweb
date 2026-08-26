<?php

namespace App\Filament\Resources\Popups\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\Popups\PopupResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPopup extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = PopupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
