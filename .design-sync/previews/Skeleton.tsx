import { Skeleton } from 'hisar-ui';

export function CardLoading() {
    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 340 }}>
            <Skeleton style={{ height: 48, width: 48, borderRadius: 9999 }} />
            <div style={{ display: 'grid', gap: 8, flex: 1 }}>
                <Skeleton style={{ height: 14, width: '70%' }} />
                <Skeleton style={{ height: 14, width: '45%' }} />
            </div>
        </div>
    );
}
