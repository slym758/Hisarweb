import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from 'hisar-ui';
import { ChevronsUpDown } from 'lucide-react';

export function Expanded() {
    return (
        <Collapsible defaultOpen style={{ width: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Gelişmiş filtreler</span>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Aç/Kapat">
                        <ChevronsUpDown />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>Bölüm: Kardiyoloji</div>
                <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>Durum: Onaylandı</div>
                <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>Tarih: Bu hafta</div>
            </CollapsibleContent>
        </Collapsible>
    );
}
