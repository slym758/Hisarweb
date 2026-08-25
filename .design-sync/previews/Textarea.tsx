import { Label, Textarea } from 'hisar-ui';

export function WithLabel() {
    return (
        <div style={{ display: 'grid', gap: 6, maxWidth: 380 }}>
            <Label htmlFor="notes">Muayene notu</Label>
            <Textarea id="notes" placeholder="Hastanın şikâyet ve bulgularını girin…" defaultValue="Hasta kontrol amaçlı geldi. Tansiyon normal, tetkikler istendi." />
        </div>
    );
}
