import { Input, Label } from 'hisar-ui';

export function WithLabel() {
    return (
        <div style={{ display: 'grid', gap: 6, maxWidth: 320 }}>
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@hisar.com" />
        </div>
    );
}

export function States() {
    return (
        <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
            <Input placeholder="Hasta ara…" />
            <Input defaultValue="Dr. Mehmet Demir" />
            <Input placeholder="Devre dışı" disabled />
        </div>
    );
}
