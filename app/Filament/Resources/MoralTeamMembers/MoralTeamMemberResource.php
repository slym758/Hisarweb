<?php

namespace App\Filament\Resources\MoralTeamMembers;

use App\Filament\Resources\MoralTeamMembers\Pages\CreateMoralTeamMember;
use App\Filament\Resources\MoralTeamMembers\Pages\EditMoralTeamMember;
use App\Filament\Resources\MoralTeamMembers\Pages\ListMoralTeamMembers;
use App\Filament\Resources\MoralTeamMembers\Schemas\MoralTeamMemberForm;
use App\Filament\Resources\MoralTeamMembers\Tables\MoralTeamMembersTable;
use App\Models\MoralTeamMember;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class MoralTeamMemberResource extends Resource
{
    protected static ?string $model = MoralTeamMember::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFaceSmile;

    protected static string|UnitEnum|null $navigationGroup = 'Bütünleşik Onkoloji';

    protected static ?string $navigationLabel = 'Moral Takımı';

    protected static ?string $modelLabel = 'Moral Takımı Üyesi';

    protected static ?string $pluralModelLabel = 'Moral Takımı';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return MoralTeamMemberForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MoralTeamMembersTable::configure($table);
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
            'index' => ListMoralTeamMembers::route('/'),
            'create' => CreateMoralTeamMember::route('/create'),
            'edit' => EditMoralTeamMember::route('/{record}/edit'),
        ];
    }
}
