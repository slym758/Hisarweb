import { Tabs, TabsContent, TabsList, TabsTrigger } from 'hisar-ui';

export function DoctorTabs() {
    return (
        <Tabs defaultValue="genel" style={{ width: 440 }}>
            <TabsList>
                <TabsTrigger value="genel">Genel</TabsTrigger>
                <TabsTrigger value="randevular">Randevular</TabsTrigger>
                <TabsTrigger value="izinler">İzinler</TabsTrigger>
            </TabsList>
            <TabsContent value="genel">
                <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
                    Dr. Mehmet Demir — Kardiyoloji Uzmanı. 8 yıl deneyim, haftalık 40 randevu kapasitesi.
                </p>
            </TabsContent>
            <TabsContent value="randevular">
                <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Bu hafta 32 randevu planlandı.</p>
            </TabsContent>
            <TabsContent value="izinler">
                <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Sıradaki izin: 4–8 Nisan.</p>
            </TabsContent>
        </Tabs>
    );
}
