import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from 'hisar-ui';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function ActionsMenu() {
    return (
        <DropdownMenu open>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">İşlemler</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Randevu</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Eye /> Görüntüle
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Pencil /> Düzenle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Trash2 /> Sil
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
