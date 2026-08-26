<?php

namespace App\Filament\Resources\HomeCenters;

use App\Filament\Resources\HomeCenters\Pages\CreateHomeCenter;
use App\Filament\Resources\HomeCenters\Pages\EditHomeCenter;
use App\Filament\Resources\HomeCenters\Pages\ListHomeCenters;
use App\Filament\Resources\HomeCenters\Schemas\HomeCenterForm;
use App\Filament\Resources\HomeCenters\Tables\HomeCentersTable;
use App\Models\HomeCenter;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class HomeCenterResource extends Resource
{
    protected static ?string $model = HomeCenter::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Pazarlama';

    protected static ?string $navigationLabel = 'Özel Merkezler (Anasayfa)';

    protected static ?string $modelLabel = 'Özel Merkez';

    protected static ?string $pluralModelLabel = 'Özel Merkezler (Anasayfa)';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return HomeCenterForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HomeCentersTable::configure($table);
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
            'index' => ListHomeCenters::route('/'),
            'create' => CreateHomeCenter::route('/create'),
            'edit' => EditHomeCenter::route('/{record}/edit'),
        ];
    }
}
