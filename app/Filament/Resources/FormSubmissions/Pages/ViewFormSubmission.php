<?php

namespace App\Filament\Resources\FormSubmissions\Pages;

use App\Filament\Resources\FormSubmissions\FormSubmissionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\ViewRecord;

class ViewFormSubmission extends ViewRecord
{
    protected static string $resource = FormSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
