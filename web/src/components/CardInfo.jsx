import { useCardInfo, useOnClickOutside } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-preact';
import { useRef } from 'react';
import { Button } from '.';
import { fetchCards, mapToCard } from '../api/ygoprodeck';
import levelIcon from '../assets/level_star.svg';
import { cn, publicAssetUrl } from '../utils';

const attributeIconsImport = import.meta.glob('../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function CardInfo() {
    const { cardSignal, isOpenSignal, setIsAutoOpen } = useCardInfo();
    const ref = useRef(null);
    useOnClickOutside(() => (isOpenSignal.value = false), { refs: [ref] });

    const cardInMemory = cardSignal.value;
    const isOpen = isOpenSignal.value;

    if (!cardInMemory) return null;

    const { data: card, isLoading } = useQuery({
        queryKey: ['card', cardInMemory.id],
        queryFn: () => fetchCards([cardInMemory.id]),
        placeholderData: cardInMemory,
        select: (data) => (data && data.length > 0 ? mapToCard(data[0]) : null),
    });

    const frameStyles = {
        normal: 'bg-amber-100 text-black',
        effect: 'bg-orange-500 text-white',
        ritual: 'bg-blue-800 text-white',
    };

    return (
        <div
            ref={ref}
            class={cn(
                'fixed left-0 z-99 flex h-[calc(100%-48px)] w-72 flex-col bg-zinc-800 transition-transform duration-250 ease-in-out',
                isOpen ? 'translate-x-0' : '-translate-x-full',
            )}
        >
            <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                    if (isOpen) {
                        setIsAutoOpen(false);
                        isOpenSignal.value = false;
                    } else {
                        setIsAutoOpen(true);
                        isOpenSignal.value = true;
                    }
                }}
                className='absolute top-8 -right-12 flex h-10 w-10 -translate-y-1/2 rounded-full transition-all duration-250 lg:top-1/2'
            >
                <ChevronLeft
                    className={cn(
                        'transform transition-transform duration-250',
                        !isOpen && '-scale-x-100',
                    )}
                />
            </Button>

            <aside class='flex h-full flex-col pb-4'>
                <div
                    class={cn(
                        'mb-2 py-2 text-center transition-colors duration-500',
                        isLoading
                            ? 'animate-pulse bg-zinc-600'
                            : frameStyles[card?.frame || ''] || 'bg-amber-700',
                    )}
                >
                    <h2 class='min-h-7 px-4 text-lg font-bold'>
                        {isLoading ? '' : card?.name || cardInMemory.name}
                    </h2>
                </div>

                <div class='grid grid-cols-2 gap-2 overflow-hidden px-4'>
                    <img
                        src={`${publicAssetUrl}/full/${cardInMemory.id}.webp`}
                        alt={cardInMemory.name}
                        class='col-span-2 rounded-sm'
                    />

                    <InfoBox>
                        <img
                            src={
                                attributeIconsImport[
                                    `../assets/attributes/${cardInMemory.attribute}.svg`
                                ]
                            }
                            class='mr-4 h-6 w-6'
                        />
                        <span>{cardInMemory.attribute}</span>
                    </InfoBox>

                    <InfoBox>
                        <img src={levelIcon} class='mr-4 h-6 w-6' />
                        <span>{cardInMemory.level}</span>
                    </InfoBox>

                    <InfoBox>
                        <span class='mr-2 font-bold'>ATK/</span>
                        <span>
                            {cardInMemory.atk === -1 ? '?' : cardInMemory.atk}
                        </span>
                    </InfoBox>

                    <InfoBox>
                        <span class='mr-2 font-bold'>DEF/</span>
                        <span>
                            {cardInMemory.def === -1 ? '?' : cardInMemory.def}
                        </span>
                    </InfoBox>

                    <div class='col-span-2 flex items-center rounded-sm bg-zinc-700 px-2 py-2'>
                        <span
                            class={cn(
                                'font-bold',
                                isLoading && 'animate-pulse text-zinc-500',
                            )}
                        >
                            [{' '}
                            {isLoading
                                ? 'Loading...'
                                : card?.properties?.join(' / ') ||
                                  cardInMemory.properties.join(' / ')}{' '}
                            ]
                        </span>
                    </div>

                    <div class='col-span-2 overflow-hidden rounded-sm bg-zinc-900 px-3 py-2 [scrollbar-gutter:stable] hover:overflow-y-scroll'>
                        {isLoading ? (
                            <div class='space-y-2 pt-1'>
                                <div class='h-3 w-full animate-pulse rounded bg-zinc-700' />
                                <div class='h-3 w-5/6 animate-pulse rounded bg-zinc-700' />
                                <div class='h-3 w-4/6 animate-pulse rounded bg-zinc-700' />
                            </div>
                        ) : (
                            <p class='text-sm leading-relaxed tracking-wide select-text'>
                                {card?.text}
                            </p>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}

function InfoBox({ children, className }) {
    return (
        <div
            className={cn(
                'flex items-center rounded-sm bg-zinc-700 px-2 py-2',
                className,
            )}
        >
            {children}
        </div>
    );
}
