import { ScrollArea, Separator } from 'hisar-ui';

const departments = [
    'Kardiyoloji',
    'Ortopedi ve Travmatoloji',
    'Nöroloji',
    'Dahiliye',
    'Genel Cerrahi',
    'Kadın Hastalıkları ve Doğum',
    'Çocuk Sağlığı',
    'Göz Hastalıkları',
    'Kulak Burun Boğaz',
    'Üroloji',
    'Dermatoloji',
    'Psikiyatri',
];

export function DepartmentList() {
    return (
        <ScrollArea style={{ height: 200, width: 280, borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>Bölümler</div>
                {departments.map((d) => (
                    <div key={d}>
                        <div style={{ padding: '8px 0', fontSize: 14 }}>{d}</div>
                        <Separator />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
