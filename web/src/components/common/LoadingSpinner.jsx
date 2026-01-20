import { cn } from '@/utils.js';

export function LoadingSpinner({ size = 32, text = null, className = '' }) {
    return (
        <div class='flex flex-col items-center justify-center gap-2'>
            <div
                class={cn(
                    'animate-spin rounded-full border-3 border-slate-300 border-t-slate-800',
                    className,
                )}
                style={{
                    width: size,
                    height: size,
                }}
                aria-busy='true'
            />
            {text && <span class={cn('text-sm text-slate-500')}>{text}</span>}
        </div>
    );
}
