import levelIcon from '@/assets/level_star.svg';
import { highlightGraphLink } from '@/core/signals';
import { cn } from '@/utils';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-preact';
import { useState } from 'react';
import { Button } from '..';
import { publicAssetUrl } from '@/utils';

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
                'transition-translate grid grow grid-cols-[8rem_1fr] grid-rows-[auto_auto_1fr] gap-2 truncate rounded bg-zinc-800 p-2 outline-2 outline-transparent duration-300 outline-dashed xl:grid-cols-[10rem_1fr]',
                isRemoving && 'translate-x-12 opacity-75 outline-red-400',
            )}
        >
            <img
                src={`${publicAssetUrl}/full/${card.id}.webp`}
                alt={card.name}
                class={`row-span-3 rounded xl:row-span-4 ${isRemoving ? 'grayscale' : 'cursor-pointer transition-transform hover:scale-105'}`}
                onClick={() => onCardClick(card)}
            />

            <div class='text-lg'>{card.name}</div>

            <div class='flex gap-2'>
                <div class='min-h-6 min-w-6 rounded-md border border-zinc-700/80 bg-zinc-900/50 p-2'>
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
                <div class='relative min-h-6 min-w-6 rounded-md border border-zinc-700/80 bg-zinc-900/50 p-2'>
                    <img src={levelIcon} alt='Level' class='h-6 w-6' />
                    <span class='text-md absolute inset-2 right-2.5 text-center font-black text-gray-200 [text-shadow:1px_1px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]'>
                        {card.level}
                    </span>
                </div>
                <span class='grow rounded-md border border-zinc-700/80 bg-zinc-900/50 p-2 text-gray-200'>
                    [{card.properties[0]}]
                </span>
                <div class='rounded-md border border-zinc-700/80 bg-zinc-900/50 p-2 text-gray-200 lg:max-xl:hidden'>
                    <span class='font-bold'>ATK</span>
                    <span>/ {card.atk === -1 ? '?' : card.atk}</span>
                </div>
                <div class='rounded-md border border-zinc-700/80 bg-zinc-900/50 p-2 text-gray-200 lg:max-xl:hidden'>
                    <span class='font-bold'>DEF</span>
                    <span>/ {card.def === -1 ? '?' : card.def}</span>
                </div>
            </div>
            <div class='flex flex-col gap-1'>
                <div class='flex items-center justify-between text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    <span>Connections</span>
                    <span>{card.links.length} Targets</span>
                </div>

                <div class='flex flex-col gap-1'>
                    {visibleLinks.map(({ target, bridges }) => (
                        <div
                            key={`${card.id}-${target.id}`}
                            class={cn(
                                'flex items-center gap-1 rounded-md border border-zinc-700/80 bg-zinc-900/50 px-3 py-1.5 text-xs transition-colors',
                                !isRemoving &&
                                    'cursor-pointer hover:border-zinc-600 hover:bg-zinc-700',
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isRemoving) return;
                                highlightGraphLink.value = {
                                    source: card,
                                    target,
                                };
                            }}
                        >
                            {bridges.map((bridge) => (
                                <img
                                    src={`${publicAssetUrl}/cropped/${bridge.id}.webp`}
                                    key={`${card.id}-${bridge.id}-${target.id}`}
                                    alt={bridge.name}
                                    class='h-6 w-6 rounded-full'
                                />
                            ))}

                            <ArrowRight
                                size={12}
                                class='ml-auto text-zinc-500'
                            />

                            <img
                                src={`${publicAssetUrl}/cropped/${target.id}.webp`}
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
                        className='flex w-full items-center justify-center gap-1 rounded py-1 text-xs font-medium text-zinc-400'
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
