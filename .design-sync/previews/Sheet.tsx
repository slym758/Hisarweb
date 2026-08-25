import { Button, Input, Label, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from 'hisar-ui';

export function EditSheet() {
    return (
        <Sheet open>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Doktor düzenle</SheetTitle>
                    <SheetDescription>Bilgileri güncelleyip kaydedin.</SheetDescription>
                </SheetHeader>
                <div style={{ display: 'grid', gap: 14, padding: '16px 0' }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                        <Label>Ad Soyad</Label>
                        <Input defaultValue="Dr. Mehmet Demir" />
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                        <Label>Unvan</Label>
                        <Input defaultValue="Kardiyoloji Uzmanı" />
                    </div>
                </div>
                <SheetFooter>
                    <Button>Kaydet</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
