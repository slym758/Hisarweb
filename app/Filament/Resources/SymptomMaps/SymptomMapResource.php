<?php

namespace App\Filament\Resources\SymptomMaps;

use App\Filament\Resources\SymptomMaps\Pages\CreateSymptomMap;
use App\Filament\Resources\SymptomMaps\Pages\EditSymptomMap;
use App\Filament\Resources\SymptomMaps\Pages\ListSymptomMaps;
use App\Filament\Resources\SymptomMaps\Schemas\SymptomMapForm;
use App\Filament\Resources\SymptomMaps\Tables\SymptomMapsTable;
use App\Models\SymptomMap;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class SymptomMapResource extends Resource
{
    protected static ?string $model = SymptomMap::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Sağlık Hizmetleri';

    protected static ?string $navigationLabel = 'Belirti Eşlemesi';

    protected static ?string $modelLabel = 'Belirti';

    protected static ?string $pluralModelLabel = 'Belirtiler';

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return SymptomMapForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SymptomMapsTable::configure($table);
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
            'index' => ListSymptomMaps::route('/'),
            'create' => CreateSymptomMap::route('/create'),
            'edit' => EditSymptomMap::route('/{record}/edit'),
        ];
    }
}
