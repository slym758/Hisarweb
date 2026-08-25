import * as React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

// Adapted from shadcn/ui: drops the `next-themes` dependency (this is a Laravel +
// Inertia SPA, not Next). Theme follows the app's `.dark` class on <html>.
const Toaster = ({ ...props }: ToasterProps) => {
    const [theme, setTheme] = React.useState<ToasterProps['theme']>('system');

    React.useEffect(() => {
        const root = document.documentElement;
        const sync = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light');
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
