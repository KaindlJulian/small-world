import { cn } from '@/utils';

const VARIANTS = {
    primary: 'bg-teal-600 text-foreground hover:bg-teal-600/80',
    secondary: 'bg-slate-600 text-foreground hover:bg-slate-600/80',
    destructive: 'bg-red-500 text-foreground hover:bg-red-500/80',
    outline: 'border border-slate-400 bg-transparent hover:bg-slate-700',
    ghost: 'bg-transparent text-foreground  hover:bg-slate-600',
};

const SIZES = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    icon: 'h-9 w-9',
};

export function Button({
    children,
    variant = 'primary',
    size = 'default',
    className,
    ...props
}) {
    return (
        <button
            {...props}
            class={cn(
                'focus-visible:ring-ring ring-offset-background inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors',
                VARIANTS[variant],
                SIZES[size],
                className,
            )}
        >
            {children}
        </button>
    );
}
