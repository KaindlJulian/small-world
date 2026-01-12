import levelIcon from '@/assets/level_star.svg';
import { ArrowRight, Minus } from 'lucide-preact';
import { Button } from '../';

const attributeIconsImport = import.meta.glob('../../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function DeckDetailsView({ list, isRemovingCards, onCardClick }) {
    return (
        <div class='deck-container flex flex-col gap-4 p-4'>
            {list.map((card) => (
                <div key={card.id} class='flex'>
                    <div
                        class={`overflow-hidden transition-all duration-300 ease-in-out ${isRemovingCards ? 'w-12 pr-2' : 'w-0 pr-0'}`}
                    >
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => onCardClick(card)}
                        >
                            <Minus />
                        </Button>
                    </div>

                    <div
                        class={`grid grow grid-cols-[4rem_1fr] grid-rows-[auto_auto_1fr] gap-2 truncate rounded bg-slate-700 p-2 xl:grid-cols-[6rem_1fr] ${
                            isRemovingCards
                                ? 'opacity-75 outline-2 outline-red-400 outline-dashed'
                                : 'cursor-pointer hover:bg-slate-600'
                        }`}
                        onClick={() => onCardClick(card)}
                    >
                        <img
                            src='card.jpg'
                            alt={card.name}
                            class={`row-span-3 rounded xl:row-span-4 ${isRemovingCards && 'grayscale'}`}
                        />

                        <div class='text-lg'>{card.name}</div>
                        <div class='flex gap-1.5 xl:gap-3'>
                            <img
                                src={
                                    attributeIconsImport[
                                        `../../assets/attributes/${card.attribute}.svg`
                                    ]
                                }
                                alt={card.attribute}
                                class='h-6 w-6'
                            />
                            <div class='relative min-h-6 min-w-6'>
                                <img
                                    src={levelIcon}
                                    alt='Level'
                                    class='h-6 w-6'
                                />
                                <span class='text-md absolute inset-0 -left-px h-6 w-6 text-center font-black text-gray-200 [text-shadow:1px_1px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]'>
                                    {card.level}
                                </span>
                            </div>
                            <span>[{card.properties[0]}]</span>
                            <div class='max-xl:hidden'>
                                <span class='font-bold'>ATK</span>
                                <span>/ {card.atk}</span>
                            </div>
                            <div class='max-xl:hidden'>
                                <span class='font-bold'>DEF</span>
                                <span>/ {card.def}</span>
                            </div>
                        </div>
                        <div class='flex flex-col gap-1'>
                            <span class='mb-1'>
                                Connections ({card.links.length}){' '}
                            </span>
                            {card.links.map(({ target, bridges }) => (
                                <div
                                    class='flex pl-4'
                                    key={`${card.id}-${target.id}`}
                                >
                                    <Minus class='text-gray-300' />
                                    {bridges.map((bridge) => (
                                        <img
                                            src='bg.jpg'
                                            key={`${card.id}-${bridge.id}-${target.id}`}
                                            alt={bridge.name}
                                            class='-mr-2 h-6 w-6 rounded-full'
                                        />
                                    ))}
                                    <ArrowRight class='ml-2 text-gray-300' />
                                    <img
                                        src='bg.jpg'
                                        alt={target.name}
                                        class='h-6 w-6 rounded-full'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
