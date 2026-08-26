<?php

namespace App\Filament\Resources\PressItems;

use App\Filament\Resources\PressItems\Pages\CreatePressItem;
use App\Filament\Resources\PressItems\Pages\EditPressItem;
use App\Filament\Resources\PressItems\Pages\ListPressItems;
use App\Filament\Resources\PressItems\Schemas\PressItemForm;
use App\Filament\Resources\PressItems\Tables\PressItemsTable;
use App\Models\PressItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PressItemResource extends Resource
{
    protected static ?string $model = PressItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'İçerik';

    protected static ?string $navigationLabel = 'Basın';

    protected static ?string $modelLabel = 'Basın';

    protected static ?string $pluralModelLabel = 'Basın';

    protected static ?string $recordTitleAttribute = 'slug';

    public static function form(Schema $schema): Schema
    {
        return PressItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PressItemsTable::configure($table);
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
            'index' => ListPressItems::route('/'),
            'create' => CreatePressItem::route('/create'),
            'edit' => EditPressItem::route('/{record}/edit'),
        ];
    }
}
