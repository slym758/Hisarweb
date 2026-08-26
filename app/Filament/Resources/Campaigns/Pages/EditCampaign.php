<?php

namespace App\Filament\Resources\Campaigns\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\Campaigns\CampaignResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCampaign extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = CampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
