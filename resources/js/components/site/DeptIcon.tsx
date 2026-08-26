import type { Department } from '@/lib/site-data';

/**
 * Renders a department's icon: the admin-uploaded custom icon/SVG when present, otherwise
 * the lucide icon resolved from its name. Same box — pass the sizing `className`.
 */
export function DeptIcon({
    dept,
    className,
    strokeWidth,
}: {
    dept: Department;
    className?: string;
    strokeWidth?: number;
}) {
    if (dept.iconImage) {
        return <img src={dept.iconImage} alt="" aria-hidden className={className} />;
    }
    const Icon = dept.icon;
    return <Icon className={className} strokeWidth={strokeWidth} />;
}
