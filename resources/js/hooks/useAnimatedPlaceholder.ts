import { useEffect, useState } from 'react';

/**
 * Returns a live "typing" string that cycles through the given suggestions.
 * Pauses whenever the input already has a value or the user has focused it.
 * Honors prefers-reduced-motion by returning the first suggestion as a static
 * placeholder.
 */
export function useAnimatedPlaceholder(suggestions: readonly string[], active: boolean = true): string {
    const [typed, setTyped] = useState('');

    useEffect(() => {
        if (!active || suggestions.length === 0) {
            setTyped('');
            return;
        }
        const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            setTyped(suggestions[0]);
            return;
        }
        let wordIdx = 0;
        let charIdx = 0;
        let deleting = false;
        let timer: ReturnType<typeof setTimeout>;
        const tick = () => {
            const word = suggestions[wordIdx];
            if (!deleting) {
                charIdx++;
                setTyped(word.slice(0, charIdx));
                if (charIdx === word.length) {
                    deleting = true;
                    timer = setTimeout(tick, 1400);
                    return;
                }
            } else {
                charIdx--;
                setTyped(word.slice(0, charIdx));
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx = (wordIdx + 1) % suggestions.length;
                }
            }
            timer = setTimeout(tick, deleting ? 45 : 90);
        };
        timer = setTimeout(tick, 400);
        return () => clearTimeout(timer);
    }, [active, suggestions]);

    return typed || suggestions[0] || '';
}
