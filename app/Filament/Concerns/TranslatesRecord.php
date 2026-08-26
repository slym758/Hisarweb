<?php

namespace App\Filament\Concerns;

use App\Filament\Support\LocaleTabs;

/**
 * For a resource Edit page whose model uses spatie/translatable: load the full {tr,en,…}
 * translations map into each translatable attribute so the `"attr.$locale"` form fields
 * (see {@see LocaleTabs}) populate. Saving writes the whole map back
 * (the model's array setter → setTranslations), so no locale is lost.
 */
trait TranslatesRecord
{
    protected function mutateFormDataBeforeFill(array $data): array
    {
        $record = $this->getRecord();

        foreach (($record->translatable ?? []) as $attribute) {
            $data[$attribute] = $record->getTranslations($attribute);
        }

        return $data;
    }
}
