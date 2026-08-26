<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Support\AutoPageCopyFields;
use App\Filament\Support\HomeCopyFields;
use App\Filament\Support\LocaleTabs;
use App\Filament\Support\OncologyCopyFields;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Editing form for an editable {@see Page}. The page's own translatable fields (admin label +
 * SEO) are edited per-locale via {@see LocaleTabs}; the page body text is edited through the
 * `copy` tree — a bespoke editor for home + the oncology pages, and a generic auto-generated
 * editor for every other page ({@see AutoPageCopyFields}). Both write to Page.copy, which the
 * frontend deep-merges over the inline COPY (usePageCopy).
 */
class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Genel')
                ->columns(2)
                ->schema([
                    TextInput::make('slug')
                        ->label('Slug (rota anahtarı)')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->helperText('Sayfanın rota anahtarı, örn. kurumsal, vizyon-misyon.'),
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                    LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                        TextInput::make("title.$locale")
                            ->label('Başlık (yönetim etiketi)')
                            ->required($isDefault),
                    ]),
                ]),

            Section::make('SEO')
                ->columns(2)
                ->schema([
                    LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                        TextInput::make("seo_title.$locale")
                            ->label('SEO başlığı'),
                        Textarea::make("seo_description.$locale")
                            ->label('SEO açıklaması')
                            ->rows(3),
                    ]),
                    FileUpload::make('og_image_path')
                        ->label('OG görseli')
                        ->image()
                        ->disk('public')
                        ->directory('pages'),
                    TextInput::make('og_image_url')
                        ->label('OG görseli URL')
                        ->url()
                        ->helperText('Yükleme yoksa bu adres kullanılır.'),
                ]),

            // Bespoke, editor-friendly text sections for the Integrated Oncology pages
            // (visible only on their own page; write to the page's `copy` tree).
            ...OncologyCopyFields::sections(),

            // Homepage text sections (visible only on the home page).
            ...HomeCopyFields::sections(),

            // Generic, record-driven text editor for every other static page (auto-generated
            // from the page's own copy tree). Hidden for pages that have a bespoke editor above.
            AutoPageCopyFields::section(),
        ]);
    }
}
