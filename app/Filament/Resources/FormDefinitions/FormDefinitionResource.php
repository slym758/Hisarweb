<?php

namespace App\Filament\Resources\FormDefinitions;

use App\Filament\Resources\FormDefinitions\Pages\CreateFormDefinition;
use App\Filament\Resources\FormDefinitions\Pages\EditFormDefinition;
use App\Filament\Resources\FormDefinitions\Pages\ListFormDefinitions;
use App\Filament\Resources\FormDefinitions\Schemas\FormDefinitionForm;
use App\Filament\Resources\FormDefinitions\Tables\FormDefinitionsTable;
use App\Models\FormDefinition;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FormDefinitionResource extends Resource
{
    protected static ?string $model = FormDefinition::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Formlar';

    protected static ?string $navigationLabel = 'Form Tanımları';

    protected static ?string $modelLabel = 'Form Tanımı';

    protected static ?string $pluralModelLabel = 'Form Tanımları';

    protected static ?string $recordTitleAttribute = 'key';

    public static function form(Schema $schema): Schema
    {
        return FormDefinitionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FormDefinitionsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFormDefinitions::route('/'),
            'create' => CreateFormDefinition::route('/create'),
            'edit' => EditFormDefinition::route('/{record}/edit'),
        ];
    }
}
