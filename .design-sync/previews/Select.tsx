import { Label, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'hisar-ui';

export function Department() {
    return (
        <div style={{ display: 'grid', gap: 6, width: 260 }}>
            <Label>Bölüm</Label>
            <Select defaultValue="kardiyoloji">
                <SelectTrigger>
                    <SelectValue placeholder="Bölüm seçin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Dahili birimler</SelectLabel>
                        <SelectItem value="kardiyoloji">Kardiyoloji</SelectItem>
                        <SelectItem value="dahiliye">Dahiliye</SelectItem>
                        <SelectItem value="noroloji">Nöroloji</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Cerrahi birimler</SelectLabel>
                        <SelectItem value="ortopedi">Ortopedi</SelectItem>
                        <SelectItem value="genel-cerrahi">Genel Cerrahi</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
