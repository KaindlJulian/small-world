import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils';

export function Sidebar({ isFullscreen, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef(null);

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const minSwipeDistance = 50;

    useEffect(() => {
        const element = drawerRef.current;
        if (!element) return;

        const onTouchStart = (e) => {
            touchStartY.current = e.changedTouches[0].screenY;
        };

        const onTouchEnd = (e) => {
            touchEndY.current = e.changedTouches[0].screenY;
            checkDirection();
        };

        const checkDirection = () => {
            const distance = touchStartY.current - touchEndY.current;
            const isSwipeUp = distance > minSwipeDistance;
            const isSwipeDown = distance < -minSwipeDistance;

            if (isSwipeUp) setIsOpen(true);
            if (isSwipeDown) setIsOpen(false);
        };

        element.addEventListener('touchstart', onTouchStart, { passive: true });
        element.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', onTouchStart);
            element.removeEventListener('touchend', onTouchEnd);
        };
    }, []);

    return (
        <div
            ref={drawerRef}
            class={cn(
                'fixed right-0 bottom-0 left-0 z-50 flex w-full flex-col bg-zinc-900 transition-transform duration-300 ease-in-out',
                'lg:relative lg:h-full lg:min-h-100 lg:translate-y-0 lg:transform-none',
                isFullscreen ? 'h-screen' : 'h-[85vh]',
                isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-24px)]',
            )}
        >
            <div
                class='flex h-6 w-full cursor-pointer items-center justify-center rounded-t-xl border-t border-zinc-700 bg-zinc-800 lg:hidden'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div class='h-1.5 w-16 rounded-full bg-zinc-500/50' />
            </div>

            <div class='h-full overflow-y-auto'>{children}</div>
        </div>
    );
}
