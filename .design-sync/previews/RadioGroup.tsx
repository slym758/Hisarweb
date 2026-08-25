import { Label, RadioGroup, RadioGroupItem } from 'hisar-ui';

const rowStyle = { display: 'flex', alignItems: 'center', gap: 10 } as const;

export function Options() {
    return (
        <RadioGroup defaultValue="online" style={{ display: 'grid', gap: 12 }}>
            <div style={rowStyle}>
                <RadioGroupItem value="online" id="r1" />
                <Label htmlFor="r1">Online randevu</Label>
            </div>
            <div style={rowStyle}>
                <RadioGroupItem value="telefon" id="r2" />
                <Label htmlFor="r2">Telefonla randevu</Label>
            </div>
            <div style={rowStyle}>
                <RadioGroupItem value="yuzyuze" id="r3" />
                <Label htmlFor="r3">Yüz yüze başvuru</Label>
            </div>
        </RadioGroup>
    );
}
