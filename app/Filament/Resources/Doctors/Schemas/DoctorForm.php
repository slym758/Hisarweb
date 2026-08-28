<?php

namespace App\Filament\Resources\Doctors\Schemas;

use App\Filament\Support\LocaleTabs;
use App\Filament\Support\RelatedContent;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DoctorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('code')
                            ->label('Kod')
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('email')
                            ->label('E-posta')
                            ->email(),
                        TextInput::make('appointment_url')
                            ->label('Randevu bağlantısı (doktora özel)')
                            ->helperText('Boşsa genel randevu bağlantısı kullanılır.'),
                        Select::make('department_id')
                            ->label('Bölüm')
                            ->relationship('department', 'slug')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('hospital_id')
                            ->label('Birincil hastane')
                            ->relationship('hospital', 'slug')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->loc('name'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('hospitals')
                            ->label('Çalıştığı hastaneler (çoklu)')
                            ->helperText('Doktor birden fazla hastanede çalışıyorsa hepsini seçin. Boşsa birincil hastane kullanılır.')
                            ->relationship(name: 'hospitals', titleAttribute: 'slug')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->loc('name'))
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->columnSpanFull(),
                        FileUpload::make('photo_path')
                            ->label('Fotoğraf')
                            ->image()
                            ->disk('public')
                            ->directory('doctors'),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi'),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("name.$locale")
                        ->label('Ad Soyad')
                        ->required($isDefault),
                    TextInput::make("appointment_note.$locale")
                        ->label('Randevu notu (opsiyonel)'),
                    TextInput::make("title.$locale")
                        ->label('Unvan')
                        ->required($isDefault),
                    Textarea::make("bio.$locale")
                        ->label('Biyografi')
                        ->rows(3),
                    Repeater::make("subspecialties.$locale")
                        ->label('Uzmanlık alanları')
                        ->simple(TextInput::make('value'))
                        ->collapsed()
                        ->collapsible(),
                    Repeater::make("languages.$locale")
                        ->label('Diller')
                        ->simple(TextInput::make('value'))
                        ->collapsed()
                        ->collapsible(),
                    Section::make('Özgeçmiş (CV)')
                        ->schema([
                            Repeater::make("cv.$locale.about")
                                ->label('Hakkında')
                                ->simple(Textarea::make('value')->rows(2))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("cv.$locale.interventional")
                                ->label('Girişimsel deneyim')
                                ->simple(Textarea::make('value')->rows(2))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("cv.$locale.education")
                                ->label('Eğitim')
                                ->simple(Textarea::make('value')->rows(2))
                                ->collapsed()
                                ->collapsible(),
                            Repeater::make("cv.$locale.experience")
                                ->label('Deneyim')
                                ->simple(Textarea::make('value')->rows(2))
                                ->collapsed()
                                ->collapsible(),
                            Textarea::make("cv.$locale.publications")
                                ->label('Yayınlar')
                                ->rows(3),
                            Repeater::make("cv.$locale.memberships")
                                ->label('Üyelikler')
                                ->simple(Textarea::make('value')->rows(2))
                                ->collapsed()
                                ->collapsible(),
                        ])
                        ->collapsed()
                        ->collapsible(),
                ]),

                RelatedContent::section(['treatments', 'diseases', 'technologies', 'videos', 'blogPosts', 'press']),
            ]);
    }
}
