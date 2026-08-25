import { Button } from 'hisar-ui';
import { Plus, Save, Trash2 } from 'lucide-react';

const row = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' } as const;

export function Variants() {
    return (
        <div style={row}>
            <Button>Kaydet</Button>
            <Button variant="secondary">İkincil</Button>
            <Button variant="outline">Anahat</Button>
            <Button variant="ghost">Hayalet</Button>
            <Button variant="destructive">Sil</Button>
            <Button variant="link">Bağlantı</Button>
        </div>
    );
}

export function Sizes() {
    return (
        <div style={row}>
            <Button size="sm">Küçük</Button>
            <Button size="default">Normal</Button>
            <Button size="lg">Büyük</Button>
        </div>
    );
}

export function WithIcons() {
    return (
        <div style={row}>
            <Button>
                <Plus /> Yeni Kayıt
            </Button>
            <Button variant="outline">
                <Save /> Kaydet
            </Button>
            <Button variant="destructive">
                <Trash2 /> Sil
            </Button>
            <Button size="icon" variant="outline" aria-label="Ekle">
                <Plus />
            </Button>
        </div>
    );
}

export function States() {
    return (
        <div style={row}>
            <Button>Etkin</Button>
            <Button disabled>Devre dışı</Button>
            <Button variant="secondary" disabled>
                Devre dışı
            </Button>
        </div>
    );
}
