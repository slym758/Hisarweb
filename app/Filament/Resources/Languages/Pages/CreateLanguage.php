<?php

namespace App\Filament\Resources\Languages\Pages;

use App\Filament\Resources\Languages\LanguageResource;
use App\Models\Language;
use App\Support\LocaleService;
use Filament\Resources\Pages\CreateRecord;

class CreateLanguage extends CreateRecord
{
    protected static string $resource = LanguageResource::class;

    protected function afterCreate(): void
    {
        // Only one language may be the default.
        if ($this->record->is_default) {
            Language::whereKeyNot($this->record->getKey())->update(['is_default' => false]);
            LocaleService::flush();
        }
    }
}
