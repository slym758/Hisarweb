<?php

namespace App\Filament\Resources\OncologyGalleryItems;

use App\Filament\Resources\OncologyGalleryItems\Pages\CreateOncologyGalleryItem;
use App\Filament\Resources\OncologyGalleryItems\Pages\EditOncologyGalleryItem;
use App\Filament\Resources\OncologyGalleryItems\Pages\ListOncologyGalleryItems;
use App\Filament\Resources\OncologyGalleryItems\Schemas\OncologyGalleryItemForm;
use App\Filament\Resources\OncologyGalleryItems\Tables\OncologyGalleryItemsTable;
use App\Models\OncologyGalleryItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class OncologyGalleryItemResource extends Resource
{
    protected static ?string $model = OncologyGalleryItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static string|UnitEnum|null $navigationGroup = 'İçerik';

    protected static ?string $navigationLabel = 'Onkoloji Merkez Turu';

    protected static ?string $modelLabel = 'Merkez Turu Görseli';

    protected static ?string $pluralModelLabel = 'Onkoloji Merkez Turu';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return OncologyGalleryItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OncologyGalleryItemsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOncologyGalleryItems::route('/'),
            'create' => CreateOncologyGalleryItem::route('/create'),
            'edit' => EditOncologyGalleryItem::route('/{record}/edit'),
        ];
    }
}
