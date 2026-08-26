<?php

namespace App\Filament\Resources\MoralTeamMembers\Pages;

use App\Filament\Concerns\TranslatesRecord;
use App\Filament\Resources\MoralTeamMembers\MoralTeamMemberResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMoralTeamMember extends EditRecord
{
    use TranslatesRecord;

    protected static string $resource = MoralTeamMemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
