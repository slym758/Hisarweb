<?php

namespace App\Filament\Support;

use App\Filament\Concerns\TranslatesRecord;
use App\Support\LocaleService;
use Closure;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

/**
 * Builds a language-tab group (one tab per active site language) for editing translatable
 * fields. The callback returns the field components for a locale; bind fields with the
 * `"attr.$locale"` dot path so they read/write the {tr,en,…} translations map. Pair with
 * {@see TranslatesRecord} on the Edit page so existing translations
 * load into those paths.
 *
 * Usage:
 *   LocaleTabs::make(fn (string $locale, bool $isDefault) => [
 *       TextInput::make("name.$locale")->required($isDefault),
 *   ])
 */
class LocaleTabs
{
    public static function make(Closure $fieldsForLocale): Tabs
    {
        $tabs = [];

        foreach (LocaleService::all() as $language) {
            $tabs[] = Tab::make($language['native_name'])
                ->schema($fieldsForLocale($language['code'], $language['is_default']));
        }

        return Tabs::make('translations')
            ->tabs($tabs)
            ->columnSpanFull();
    }
}
