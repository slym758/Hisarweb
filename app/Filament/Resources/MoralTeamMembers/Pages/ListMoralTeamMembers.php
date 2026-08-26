<?php

namespace App\Filament\Resources\MoralTeamMembers\Pages;

use App\Filament\Resources\MoralTeamMembers\MoralTeamMemberResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMoralTeamMembers extends ListRecords
{
    protected static string $resource = MoralTeamMemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
