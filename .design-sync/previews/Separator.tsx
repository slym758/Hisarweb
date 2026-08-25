import { Separator } from 'hisar-ui';

export function Horizontal() {
    return (
        <div style={{ maxWidth: 340 }}>
            <div style={{ fontWeight: 600 }}>Hisar Design System</div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>Yönetim paneli bileşenleri</div>
            <Separator style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <span>Bileşenler</span>
                <Separator orientation="vertical" style={{ height: 20 }} />
                <span>Token'lar</span>
                <Separator orientation="vertical" style={{ height: 20 }} />
                <span>Dokümanlar</span>
            </div>
        </div>
    );
}
