<?php

namespace App\Filament\Resources\Technologies\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\Technologies\TechnologyResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTechnology extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = TechnologyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
