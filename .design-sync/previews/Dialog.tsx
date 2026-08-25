import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'hisar-ui';

export function ConfirmDialog() {
    return (
        <Dialog open>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Randevuyu iptal et</DialogTitle>
                    <DialogDescription>Bu işlem geri alınamaz. Hasta otomatik olarak bilgilendirilecek.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Vazgeç</Button>
                    <Button variant="destructive">İptal Et</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
