<?php

namespace App\Filament\Pages;

use App\Filament\Support\LocaleTabs;
use App\Models\SiteSetting;
use App\Support\SettingsService;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Schema;

/**
 * Admin page to manage the site settings singleton (call-center phone, WhatsApp,
 * appointment CTA and social links) — a single form over the `site_settings` table.
 * Translatable values (whatsapp_message, appointment_label, footer_tagline) are edited
 * per-locale via {@see LocaleTabs}; everything else is a plain text input. Saving writes
 * each key back and flushes {@see SettingsService}'s cache so the frontend updates.
 */
class ManageSiteSettings extends Page
{
    use InteractsWithSchemas;

    protected static string|\UnitEnum|null $navigationGroup = 'Ayarlar';

    protected static ?string $navigationLabel = 'Site Ayarları';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-adjustments-horizontal';

    protected static ?string $slug = 'site-settings';

    protected string $view = 'filament.pages.manage-site-settings';

    /** @var array<string,mixed> */
    public ?array $data = [];

    /** Setting keys whose value is a translatable {tr,en,…} map. */
    protected const TRANSLATABLE_KEYS = ['whatsapp_message', 'appointment_label', 'footer_tagline'];

    /** All scalar (single-value) setting keys. */
    protected const SCALAR_KEYS = [
        'phone_display', 'phone_href', 'whatsapp_number', 'appointment_url',
        'instagram_url', 'facebook_url', 'x_url', 'youtube_url', 'linkedin_url',
    ];

    public function getHeading(): string
    {
        return 'Site Ayarları';
    }

    public function mount(): void
    {
        $data = [];

        foreach (self::SCALAR_KEYS as $key) {
            $data[$key] = (string) (SettingsService::get($key) ?? '');
        }

        foreach (self::TRANSLATABLE_KEYS as $key) {
            $value = SettingsService::get($key);
            $data[$key] = is_array($value) ? $value : [];
        }

        $this->form->fill($data);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('İletişim')
                    ->icon('heroicon-o-phone')
                    ->columns(2)
                    ->schema([
                        TextInput::make('phone_display')
                            ->label('Telefon (görünen)')
                            ->placeholder('444 5 888'),
                        TextInput::make('phone_href')
                            ->label('Telefon bağlantısı (tel:)')
                            ->placeholder('tel:4445888'),
                        TextInput::make('whatsapp_number')
                            ->label('WhatsApp numarası (rakam)')
                            ->helperText('wa.me için yalnızca rakamlar, ör. 904445888')
                            ->placeholder('904445888'),
                        TextInput::make('appointment_url')
                            ->label('Randevu bağlantısı')
                            ->placeholder('/randevu-al'),
                    ]),

                Section::make('Metinler')
                    ->description('Dile göre çevrilebilir metinler.')
                    ->icon('heroicon-o-language')
                    ->schema([
                        LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                            TextInput::make("whatsapp_message.$locale")
                                ->label('WhatsApp mesajı'),
                            TextInput::make("appointment_label.$locale")
                                ->label('Randevu düğmesi metni'),
                            TextInput::make("footer_tagline.$locale")
                                ->label('Alt bilgi sloganı'),
                        ]),
                    ]),

                Section::make('Sosyal Medya')
                    ->icon('heroicon-o-share')
                    ->columns(2)
                    ->schema([
                        TextInput::make('instagram_url')
                            ->label('Instagram')
                            ->url(),
                        TextInput::make('facebook_url')
                            ->label('Facebook')
                            ->url(),
                        TextInput::make('x_url')
                            ->label('X (Twitter)')
                            ->url(),
                        TextInput::make('youtube_url')
                            ->label('YouTube')
                            ->url(),
                        TextInput::make('linkedin_url')
                            ->label('LinkedIn')
                            ->url(),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        foreach (self::SCALAR_KEYS as $key) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) ($state[$key] ?? '')],
            );
        }

        foreach (self::TRANSLATABLE_KEYS as $key) {
            $value = $state[$key] ?? [];
            $value = is_array($value) ? array_map(fn ($v) => (string) ($v ?? ''), $value) : [];

            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }

        SettingsService::flush();

        Notification::make()
            ->title('Site ayarları kaydedildi.')
            ->success()
            ->send();
    }

    /** @return array<int, Action> */
    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Kaydet')
                ->icon('heroicon-o-check')
                ->color('success')
                ->action('save')
                ->keyBindings(['mod+s']),
        ];
    }
}
