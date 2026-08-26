<?php

namespace App\Filament\Resources\OncologyGalleryItems\Pages;

use App\Filament\Resources\OncologyGalleryItems\OncologyGalleryItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOncologyGalleryItems extends ListRecords
{
    protected static string $resource = OncologyGalleryItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
