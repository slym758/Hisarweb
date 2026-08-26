<?php

namespace App\Filament\Resources\QualityCertificates\Pages;

use App\Filament\Resources\QualityCertificates\QualityCertificateResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListQualityCertificates extends ListRecords
{
    protected static string $resource = QualityCertificateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
