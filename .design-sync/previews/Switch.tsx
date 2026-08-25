import { Label, Switch } from 'hisar-ui';

const rowStyle = { display: 'flex', alignItems: 'center', gap: 10 } as const;

export function WithLabels() {
    return (
        <div style={{ display: 'grid', gap: 14 }}>
            <div style={rowStyle}>
                <Switch id="s1" defaultChecked />
                <Label htmlFor="s1">Online randevuya açık</Label>
            </div>
            <div style={rowStyle}>
                <Switch id="s2" />
                <Label htmlFor="s2">Bakım modu</Label>
            </div>
        </div>
    );
}
