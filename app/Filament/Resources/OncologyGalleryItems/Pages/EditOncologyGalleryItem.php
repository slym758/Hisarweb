<?php

namespace App\Filament\Resources\OncologyGalleryItems\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\OncologyGalleryItems\OncologyGalleryItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOncologyGalleryItem extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = OncologyGalleryItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
