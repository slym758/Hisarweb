<?php

namespace App\Filament\Resources\HomeCenters\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\HomeCenters\HomeCenterResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHomeCenter extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = HomeCenterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
