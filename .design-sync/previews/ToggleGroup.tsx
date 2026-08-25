import { ToggleGroup, ToggleGroupItem } from 'hisar-ui';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';

export function Formatting() {
    return (
        <ToggleGroup type="multiple" defaultValue={['bold']}>
            <ToggleGroupItem value="bold" aria-label="Kalın">
                <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="İtalik">
                <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Altı çizili">
                <Underline />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

export function Alignment() {
    return (
        <ToggleGroup type="single" defaultValue="left" variant="outline">
            <ToggleGroupItem value="left" aria-label="Sola">
                <AlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Ortala">
                <AlignCenter />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Sağa">
                <AlignRight />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
