<?php

namespace App\Filament\Resources\Hospitals\RelationManagers;

use App\Filament\Support\LocaleTabs;
use App\Models\HospitalRoom;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RoomsRelationManager extends RelationManager
{
    protected static string $relationship = 'rooms';

    protected static ?string $title = 'Odalar';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            FileUpload::make('image_path')
                ->label('Oda görseli')
                ->image()
                ->disk('public')
                ->directory('hospital-rooms'),
            LocaleTabs::make(fn (string $locale, bool $isDefault) => [
                TextInput::make("name.$locale")->label('Ad')->required($isDefault),
                Textarea::make("description.$locale")->label('Açıklama')->rows(2),
            ]),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->reorderable('order_column')
            ->defaultSort('order_column')
            ->columns([
                TextColumn::make('name')->label('Ad')->searchable(),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make()->mutateRecordDataUsing(function (array $data, HospitalRoom $record): array {
                    // Load the full {tr,en,…} maps so the locale-tab fields populate on edit.
                    foreach ($record->translatable as $attribute) {
                        $data[$attribute] = $record->getTranslations($attribute);
                    }

                    return $data;
                }),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
