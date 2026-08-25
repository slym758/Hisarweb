import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'hisar-ui';

export function StatCard() {
    return (
        <Card style={{ maxWidth: 340 }}>
            <CardHeader>
                <CardDescription>Bu ay oluşturulan randevular</CardDescription>
                <CardTitle style={{ fontSize: 30 }}>1.284</CardTitle>
            </CardHeader>
            <CardContent>
                <p style={{ color: 'var(--success)', fontSize: 13, margin: 0 }}>▲ Geçen aya göre %12 artış</p>
            </CardContent>
        </Card>
    );
}

export function ContentCard() {
    return (
        <Card style={{ maxWidth: 360 }}>
            <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CardTitle>Kardiyoloji</CardTitle>
                    <Badge variant="secondary">Aktif</Badge>
                </div>
                <CardDescription>Poliklinik ve girişimsel işlemler</CardDescription>
            </CardHeader>
            <CardContent>
                <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0 }}>
                    8 doktor · 3 muayene odası · haftalık 240 randevu kapasitesi.
                </p>
            </CardContent>
            <CardFooter style={{ gap: 8 }}>
                <Button size="sm">Düzenle</Button>
                <Button size="sm" variant="outline">
                    Detaylar
                </Button>
            </CardFooter>
        </Card>
    );
}
