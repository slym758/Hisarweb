import { Toggle } from 'hisar-ui';
import { Bold, Star } from 'lucide-react';

const row = { display: 'flex', gap: 12, alignItems: 'center' } as const;

export function Variants() {
    return (
        <div style={row}>
            <Toggle aria-label="Kalın">
                <Bold />
            </Toggle>
            <Toggle defaultPressed aria-label="Favori">
                <Star /> Favori
            </Toggle>
            <Toggle variant="outline" aria-label="Anahat">
                Anahat
            </Toggle>
        </div>
    );
}
