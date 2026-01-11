import { cn } from '@/utils.js';
import { X } from 'lucide-preact';
import { createPortal, useEffect, useState } from 'react';
import { Button } from '..';

export function Modal({ isOpen, onClose, title, children }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            setIsVisible(true);
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = 'unset';
            }, 300);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return createPortal(
        <div class='fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'>
            <div
                class={cn(
                    'fixed inset-0 bg-black/60 transition-opacity',
                    isOpen ? 'opacity-100' : 'opacity-0',
                )}
                onClick={onClose}
                aria-hidden='true'
            />

            <div
                class={cn(
                    'relative w-full max-w-md transform overflow-hidden rounded-lg bg-slate-700 p-8 shadow-xl transition-all duration-300 ease-in-out',
                    isOpen
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-4 scale-95 opacity-0',
                )}
                role='dialog'
                aria-modal='true'
                aria-labelledby='modal-title'
            >
                <div class='mb-4 flex items-center justify-between'>
                    <h3 class='text-lg leading-6 font-medium' id='modal-title'>
                        {title}
                    </h3>
                    <Button variant='ghost' size='icon' onClick={onClose}>
                        <X></X>
                    </Button>
                </div>

                <div>{children}</div>
            </div>
        </div>,
        document.body,
    );
}
