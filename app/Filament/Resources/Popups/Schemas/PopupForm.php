<?php

namespace App\Filament\Resources\Popups\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Models\Popup;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Editing form for a {@see Popup}. Non-translatable settings (type, image, routing
 * globs, dismiss behaviour, publish window, priority) live in the "Genel" section; translatable
 * copy (title/body/cta_label) is edited per-locale via {@see LocaleTabs}. Image uploads store a
 * public-disk path (`image_path`); `image_url` stays as fallback. Pair with the Edit page's
 * TranslatesRecord so the spatie {tr,en,…} maps populate the locale tabs. Follows the
 * Departments/Campaign pattern.
 */
class PopupForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        Select::make('type')
                            ->label('Tür')
                            ->options([
                                'app_promo' => 'Mobil uygulama tanıtımı',
                                'modal' => 'Modal',
                                'banner' => 'Banner',
                                'lead' => 'Lead formu',
                            ])
                            ->default('app_promo')
                            ->required(),
                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                        FileUpload::make('image_path')
                            ->label('Görsel')
                            ->image()
                            ->disk('public')
                            ->directory('popups'),
                        TextInput::make('image_url')
                            ->label('Görsel URL')
                            ->helperText('Yükleme yoksa bu adres kullanılır. Örn. /assets/hisar-emblem.png'),
                        TextInput::make('cta_link')
                            ->label('CTA bağlantısı')
                            ->helperText('Örn. /mobil-uygulama veya tam URL'),
                        TextInput::make('priority')
                            ->label('Öncelik')
                            ->numeric()
                            ->default(0)
                            ->helperText('Yüksek öncelik önce gösterilir.'),
                        TagsInput::make('target_routes')
                            ->label('Gösterilecek rotalar')
                            ->helperText('Locale\'siz path globları (örn. /randevu-al, /bolum*). Boş = tüm sayfalar.')
                            ->placeholder('/bolum*'),
                        TagsInput::make('suppress_routes')
                            ->label('Gizlenecek rotalar')
                            ->helperText('Bu path globlarında gösterilmez (örn. /randevu-al, /butunlesik-onkoloji*).')
                            ->placeholder('/randevu-al'),
                        Select::make('dismiss_scope')
                            ->label('Kapatma kapsamı')
                            ->options([
                                'session' => 'Oturum (session)',
                                'days' => 'Gün sayısı',
                            ])
                            ->default('session')
                            ->live()
                            ->required(),
                        TextInput::make('dismiss_days')
                            ->label('Kapatma süresi (gün)')
                            ->numeric()
                            ->default(7)
                            ->visible(fn ($get) => $get('dismiss_scope') === 'days'),
                        DateTimePicker::make('starts_at')
                            ->label('Başlangıç tarihi'),
                        DateTimePicker::make('ends_at')
                            ->label('Bitiş tarihi'),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("title.$locale")
                        ->label('Başlık')
                        ->required($isDefault),
                    Textarea::make("body.$locale")
                        ->label('Metin')
                        ->rows(2),
                    TextInput::make("cta_label.$locale")
                        ->label('CTA etiketi'),
                ]),
            ]);
    }
}
