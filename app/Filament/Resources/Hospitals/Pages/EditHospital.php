<?php

namespace App\Filament\Resources\Hospitals\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\Hospitals\HospitalResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHospital extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = HospitalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
