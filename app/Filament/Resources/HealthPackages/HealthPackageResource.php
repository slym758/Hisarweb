<?php

namespace App\Filament\Resources\HealthPackages;

use App\Filament\Resources\HealthPackages\Pages\CreateHealthPackage;
use App\Filament\Resources\HealthPackages\Pages\EditHealthPackage;
use App\Filament\Resources\HealthPackages\Pages\ListHealthPackages;
use App\Filament\Resources\HealthPackages\Schemas\HealthPackageForm;
use App\Filament\Resources\HealthPackages\Tables\HealthPackagesTable;
use App\Models\HealthPackage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class HealthPackageResource extends Resource
{
    protected static ?string $model = HealthPackage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'İçerik';

    protected static ?string $navigationLabel = 'Paketler';

    protected static ?string $modelLabel = 'Paket';

    protected static ?string $pluralModelLabel = 'Paketler';

    protected static ?string $recordTitleAttribute = 'slug';

    public static function form(Schema $schema): Schema
    {
        return HealthPackageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HealthPackagesTable::configure($table);
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
            'index' => ListHealthPackages::route('/'),
            'create' => CreateHealthPackage::route('/create'),
            'edit' => EditHealthPackage::route('/{record}/edit'),
        ];
    }
}
