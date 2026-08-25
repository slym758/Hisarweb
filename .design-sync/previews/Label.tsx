import { Input, Label } from 'hisar-ui';

export function Default() {
    return (
        <div style={{ display: 'grid', gap: 6, maxWidth: 320 }}>
            <Label htmlFor="tc">TC Kimlik No</Label>
            <Input id="tc" inputMode="numeric" placeholder="11 haneli" />
        </div>
    );
}
