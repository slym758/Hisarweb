<?php

namespace App\Filament\Resources\QualityCertificates\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\QualityCertificates\QualityCertificateResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditQualityCertificate extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = QualityCertificateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
