<?php

namespace App\Filament\Resources\Campaigns\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CampaignForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('slug')
                            ->label('Slug (URL)')
                            ->helperText('Landing sayfası: /kampanya/{slug}')
                            ->required()
                            ->unique(ignoreRecord: true),
                        FileUpload::make('hero_image_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('campaigns'),
                        TextInput::make('cta_link')
                            ->label('CTA bağlantısı')
                            ->helperText('Örn. /randevu-al veya tam URL'),
                        DateTimePicker::make('starts_at')
                            ->label('Başlangıç tarihi'),
                        DateTimePicker::make('ends_at')
                            ->label('Bitiş tarihi'),
                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("title.$locale")
                        ->label('Başlık')
                        ->required($isDefault),
                    Textarea::make("subtitle.$locale")
                        ->label('Alt başlık')
                        ->rows(2),
                    Repeater::make("body.$locale")
                        ->label('İçerik (paragraflar)')
                        ->simple(Textarea::make('paragraph')->rows(3))
                        ->collapsed()
                        ->collapsible(),
                    TextInput::make("cta_label.$locale")
                        ->label('CTA etiketi'),
                    TextInput::make("seo_title.$locale")
                        ->label('SEO başlığı'),
                    Textarea::make("seo_description.$locale")
                        ->label('SEO açıklaması')
                        ->rows(2),
                ]),
            ]);
    }
}
