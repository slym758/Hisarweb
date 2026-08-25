import { Checkbox, Label } from 'hisar-ui';

const rowStyle = { display: 'flex', alignItems: 'center', gap: 10 } as const;

export function WithLabels() {
    return (
        <div style={{ display: 'grid', gap: 14 }}>
            <div style={rowStyle}>
                <Checkbox id="c1" defaultChecked />
                <Label htmlFor="c1">SMS ile bilgilendir</Label>
            </div>
            <div style={rowStyle}>
                <Checkbox id="c2" />
                <Label htmlFor="c2">E-posta ile bilgilendir</Label>
            </div>
            <div style={rowStyle}>
                <Checkbox id="c3" disabled />
                <Label htmlFor="c3">Push bildirimi (yakında)</Label>
            </div>
        </div>
    );
}
