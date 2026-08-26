<?php

namespace App\Filament\Resources\FormSubmissions;

use App\Filament\Resources\FormSubmissions\Pages\ListFormSubmissions;
use App\Filament\Resources\FormSubmissions\Pages\ViewFormSubmission;
use App\Filament\Resources\FormSubmissions\Schemas\FormSubmissionInfolist;
use App\Filament\Resources\FormSubmissions\Tables\FormSubmissionsTable;
use App\Models\FormSubmission;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

/**
 * Read-only admin inbox for public-form submissions. No create (submissions arrive from
 * the public site); view + delete only.
 */
class FormSubmissionResource extends Resource
{
    protected static ?string $model = FormSubmission::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInboxArrowDown;

    protected static string|UnitEnum|null $navigationGroup = 'Formlar';

    protected static ?string $navigationLabel = 'Form Gönderileri';

    protected static ?string $modelLabel = 'Form Gönderisi';

    protected static ?string $pluralModelLabel = 'Form Gönderileri';

    public static function table(Table $table): Table
    {
        return FormSubmissionsTable::configure($table);
    }

    public static function infolist(Schema $schema): Schema
    {
        return FormSubmissionInfolist::configure($schema);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFormSubmissions::route('/'),
            'view' => ViewFormSubmission::route('/{record}'),
        ];
    }
}
