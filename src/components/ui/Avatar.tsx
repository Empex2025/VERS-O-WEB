import { cn } from '../../lib/utils';

// Paleta determinística para os avatares (sem imagens reais ainda)
const COLORS = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500',
    'bg-amber-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500',
];

function initials(name: string): string {
    const parts = name.replace(/^@/, '').trim().split(/[\s._]+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFor(name: string): string {
    const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return COLORS[sum % COLORS.length];
}

interface AvatarProps {
    name: string;
    size?: number;
    className?: string;
    ring?: boolean;
}

export function Avatar({ name, size = 40, className, ring }: AvatarProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-full text-white font-bold shrink-0 select-none',
                colorFor(name),
                ring && 'ring-2 ring-[#407BFF] ring-offset-2',
                className,
            )}
            style={{ width: size, height: size, fontSize: size * 0.38 }}
            aria-hidden="true"
        >
            {initials(name)}
        </div>
    );
}
