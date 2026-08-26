<?php

namespace App\Filament\Resources\QualityCertificates;

use App\Filament\Resources\QualityCertificates\Pages\CreateQualityCertificate;
use App\Filament\Resources\QualityCertificates\Pages\EditQualityCertificate;
use App\Filament\Resources\QualityCertificates\Pages\ListQualityCertificates;
use App\Filament\Resources\QualityCertificates\Schemas\QualityCertificateForm;
use App\Filament\Resources\QualityCertificates\Tables\QualityCertificatesTable;
use App\Models\QualityCertificate;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class QualityCertificateResource extends Resource
{
    protected static ?string $model = QualityCertificate::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Kurumsal';

    protected static ?string $navigationLabel = 'Kalite Belgeleri';

    protected static ?string $modelLabel = 'Kalite Belgesi';

    protected static ?string $pluralModelLabel = 'Kalite Belgeleri';

    protected static ?string $recordTitleAttribute = 'slug';

    public static function form(Schema $schema): Schema
    {
        return QualityCertificateForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return QualityCertificatesTable::configure($table);
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
            'index' => ListQualityCertificates::route('/'),
            'create' => CreateQualityCertificate::route('/create'),
            'edit' => EditQualityCertificate::route('/{record}/edit'),
        ];
    }
}
