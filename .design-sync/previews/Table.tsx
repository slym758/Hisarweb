import { Badge, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from 'hisar-ui';

const rows = [
    { ad: 'Ayşe Yılmaz', bolum: 'Kardiyoloji', tarih: '12.03.2026', durum: 'Onaylandı', tone: 'default' },
    { ad: 'Mehmet Demir', bolum: 'Ortopedi', tarih: '12.03.2026', durum: 'Bekliyor', tone: 'secondary' },
    { ad: 'Zeynep Kaya', bolum: 'Nöroloji', tarih: '13.03.2026', durum: 'İptal', tone: 'destructive' },
    { ad: 'Ali Şahin', bolum: 'Dahiliye', tarih: '13.03.2026', durum: 'Onaylandı', tone: 'default' },
] as const;

export function AppointmentsTable() {
    return (
        <div style={{ maxWidth: 620 }}>
            <Table>
                <TableCaption>Son randevu talepleri</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Hasta</TableHead>
                        <TableHead>Bölüm</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Durum</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.ad}>
                            <TableCell style={{ fontWeight: 500 }}>{r.ad}</TableCell>
                            <TableCell>{r.bolum}</TableCell>
                            <TableCell>{r.tarih}</TableCell>
                            <TableCell style={{ textAlign: 'right' }}>
                                <Badge variant={r.tone as 'default' | 'secondary' | 'destructive'}>{r.durum}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
