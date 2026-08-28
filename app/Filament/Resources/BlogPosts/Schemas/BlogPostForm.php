<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use App\Filament\Support\LocaleTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Genel')
                    ->schema([
                        TextInput::make('slug')
                            ->label('Slug (URL)')
                            ->required()
                            ->unique(ignoreRecord: true),
                        Select::make('department_id')
                            ->label('Bölüm/Kategori')
                            ->relationship('department', 'slug')
                            ->searchable()
                            ->preload()
                            ->nullable(),
                        FileUpload::make('cover_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('blog'),
                        DatePicker::make('published_at')
                            ->label('Yayın tarihi'),
                        Select::make('status')
                            ->label('Durum')
                            ->options(['draft' => 'Taslak', 'published' => 'Yayında'])
                            ->default('published')
                            ->required(),
                        Toggle::make('home_featured')
                            ->label('Anasayfada öne çıkar')
                            ->helperText('İşaretlenen yazılar anasayfa "Rehber" bölümünde gösterilir (en fazla 4).'),
                    ])
                    ->columns(2),

                LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                    TextInput::make("slug_i18n.$locale")
                        ->label('URL (bu dilde, opsiyonel)')
                        ->helperText('Boş bırakılırsa varsayılan slug kullanılır.'),
                    TextInput::make("title.$locale")
                        ->label('Başlık')
                        ->required($isDefault),
                    Textarea::make("excerpt.$locale")
                        ->label('Özet')
                        ->rows(2),
                    Repeater::make("body.$locale")
                        ->label('İçerik (paragraflar)')
                        ->simple(Textarea::make('value')->rows(2))
                        ->collapsed()
                        ->collapsible(),
                ]),
            ]);
    }
}
