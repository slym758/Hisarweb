import { Alert, AlertDescription, AlertTitle } from 'hisar-ui';
import { AlertTriangle, Info } from 'lucide-react';

export function Info_() {
    return (
        <Alert style={{ maxWidth: 460 }}>
            <Info />
            <AlertTitle>Bilgilendirme</AlertTitle>
            <AlertDescription>Randevu hatırlatmaları hastalara 24 saat önce SMS ile gönderilir.</AlertDescription>
        </Alert>
    );
}

export function Destructive() {
    return (
        <Alert variant="destructive" style={{ maxWidth: 460 }}>
            <AlertTriangle />
            <AlertTitle>İşlem başarısız</AlertTitle>
            <AlertDescription>Doktor kaydı silinemedi. Bağlı randevular olduğundan önce onları taşıyın.</AlertDescription>
        </Alert>
    );
}
