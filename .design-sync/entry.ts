// Design-system bundle entry for /design-sync (package shape).
// Re-exports every shadcn/ui primitive under resources/js/components/ui so the
// converter's IIFE assigns them all to window.HisarUI.*. This is NOT app code —
// it exists only so the design-sync bundle has a single, stable entry point.
export * from '@/components/ui/accordion';
export * from '@/components/ui/alert';
export * from '@/components/ui/avatar';
export * from '@/components/ui/badge';
export * from '@/components/ui/breadcrumb';
export * from '@/components/ui/button';
export * from '@/components/ui/card';
export * from '@/components/ui/checkbox';
export * from '@/components/ui/collapsible';
export * from '@/components/ui/dialog';
export * from '@/components/ui/dropdown-menu';
export * from '@/components/ui/form';
export * from '@/components/ui/icon';
export * from '@/components/ui/input';
export * from '@/components/ui/label';
export * from '@/components/ui/navigation-menu';
export * from '@/components/ui/pagination';
export * from '@/components/ui/placeholder-pattern';
export * from '@/components/ui/popover';
export * from '@/components/ui/radio-group';
export * from '@/components/ui/scroll-area';
export * from '@/components/ui/select';
export * from '@/components/ui/separator';
export * from '@/components/ui/sheet';
export * from '@/components/ui/sidebar';
export * from '@/components/ui/skeleton';
export * from '@/components/ui/sonner';
export * from '@/components/ui/switch';
export * from '@/components/ui/table';
export * from '@/components/ui/tabs';
export * from '@/components/ui/textarea';
export * from '@/components/ui/toggle';
export * from '@/components/ui/toggle-group';
export * from '@/components/ui/tooltip';
