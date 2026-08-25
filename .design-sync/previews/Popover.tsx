import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from 'hisar-ui';

export function FilterPopover() {
    return (
        <Popover open>
            <PopoverTrigger asChild>
                <Button variant="outline">Tarih aralığı</Button>
            </PopoverTrigger>
            <PopoverContent align="start">
                <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ fontWeight: 600 }}>Tarih aralığı seçin</div>
                    <div style={{ display: 'grid', gap: 6 }}>
                        <Label>Başlangıç</Label>
                        <Input type="date" defaultValue="2026-03-01" />
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                        <Label>Bitiş</Label>
                        <Input type="date" defaultValue="2026-03-31" />
                    </div>
                    <Button size="sm">Uygula</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
