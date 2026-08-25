import { Badge } from 'hisar-ui';

const row = { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' } as const;

export function Variants() {
    return (
        <div style={row}>
            <Badge>Onaylandı</Badge>
            <Badge variant="secondary">Bekliyor</Badge>
            <Badge variant="destructive">İptal</Badge>
            <Badge variant="outline">Taslak</Badge>
        </div>
    );
}
