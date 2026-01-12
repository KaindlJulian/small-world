import levelIcon from '@/assets/level_star.svg';
import { highlightGraphLink } from '@/core/signals';
import { cn } from '@/utils';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-preact';
import { useState } from 'react';
import { Button } from '..';

const attributeIconsImport = import.meta.glob('../../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function CardListItem({ card, onCardClick, isRemoving }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const previewCount = 2;
    const hiddenCount = card.links.length - previewCount;

    const shouldTruncate = card.links.length > previewCount;
    const visibleLinks = isExpanded
        ? card.links
        : card.links.slice(0, previewCount);

    return (
        <div
            class={cn(
                'grid grow grid-cols-[8rem_1fr] grid-rows-[auto_auto_1fr] gap-2 truncate rounded bg-slate-800 p-2 xl:grid-cols-[10rem_1fr]',
                isRemoving &&
                    'opacity-75 outline-2 outline-red-400 outline-dashed',
            )}
            onClick={() => onCardClick(card)}
        >
            <img
                src='card.jpg'
                alt={card.name}
                class={`row-span-3 rounded xl:row-span-4 ${isRemoving ? 'grayscale' : 'cursor-pointer transition-transform hover:scale-105'}`}
            />

            <div class='text-lg'>{card.name}</div>

            <div class='flex gap-2'>
                <div class='min-h-6 min-w-6 rounded-md border border-slate-700/80 bg-slate-900/50 p-2'>
                    <img
                        src={
                            attributeIconsImport[
                                `../../assets/attributes/${card.attribute}.svg`
                            ]
                        }
                        alt={card.attribute}
                        class='h-6 w-6'
                    />
                </div>
                <div class='relative min-h-6 min-w-6 rounded-md border border-slate-700/80 bg-slate-900/50 p-2'>
                    <img src={levelIcon} alt='Level' class='h-6 w-6' />
                    <span class='text-md absolute inset-2 right-2.5 text-center font-black text-gray-200 [text-shadow:1px_1px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]'>
                        {card.level}
                    </span>
                </div>
                <span class='grow rounded-md border border-slate-700/80 bg-slate-900/50 p-2 text-gray-200'>
                    [{card.properties[0]}]
                </span>
                <div class='rounded-md border border-slate-700/80 bg-slate-900/50 p-2 text-gray-200 max-xl:hidden'>
                    <span class='font-bold'>ATK</span>
                    <span>/ {card.atk}</span>
                </div>
                <div class='rounded-md border border-slate-700/80 bg-slate-900/50 p-2 text-gray-200 max-xl:hidden'>
                    <span class='font-bold'>DEF</span>
                    <span>/ {card.def}</span>
                </div>
            </div>
            <div class='flex flex-col gap-1'>
                <div class='flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400 uppercase'>
                    <span>Connections</span>
                    <span>{card.links.length} Targets</span>
                </div>

                <div class='flex flex-col gap-1'>
                    {visibleLinks.map(({ target, bridges }) => (
                        <div
                            key={`${card.id}-${target.id}`}
                            class={cn(
                                'flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900/50 px-3 py-1.5 text-xs transition-colors',
                                !isRemoving &&
                                    'cursor-pointer hover:border-slate-600 hover:bg-slate-700',
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                highlightGraphLink.value = {
                                    source: card,
                                    target,
                                };
                            }}
                        >
                            {bridges.map((bridge) => (
                                <img
                                    src='bg.jpg'
                                    key={`${card.id}-${bridge.id}-${target.id}`}
                                    alt={bridge.name}
                                    class='h-6 w-6 rounded-full'
                                />
                            ))}

                            <ArrowRight
                                size={12}
                                class='ml-auto text-slate-500'
                            />

                            <img
                                src='bg.jpg'
                                alt={target.name}
                                class='h-6 w-6 rounded-full'
                            />
                        </div>
                    ))}
                </div>

                {shouldTruncate && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        variant='ghost'
                        className='flex w-full items-center justify-center gap-1 rounded py-1 text-xs font-medium text-slate-400'
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp size={14} /> Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown size={14} /> Show {hiddenCount}{' '}
                                more...
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
