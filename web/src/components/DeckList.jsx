import {
    ArrowRight,
    LayoutGrid,
    List,
    Minus,
    SlidersHorizontal,
} from 'lucide-preact';
import { useState } from 'preact/hooks';
import levelIcon from '../assets/level_star.svg';

const attributeIconsImport = import.meta.glob('../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function DeckList({ cards, setCardInfo }) {
    const [isGridView, setIsGridView] = useState(true);

    if (!cards) return;

    const list = cards;

    return (
        <>
            <div class='sticky top-0 z-50 flex w-full justify-end gap-2 bg-slate-800 p-4'>
                <button
                    class='cursor-pointer rounded-md bg-slate-700 px-1.5 py-1.5 hover:bg-slate-600 hover:shadow-lg'
                    onClick={() => setIsGridView(!isGridView)}
                >
                    {isGridView ? <List /> : <LayoutGrid />}
                </button>
                <button class='cursor-pointer rounded-md bg-slate-700 px-1.5 py-1.5 hover:bg-slate-600 hover:shadow-lg'>
                    <SlidersHorizontal />
                </button>
            </div>
            {isGridView && (
                <div class='grid grid-cols-10 gap-4 p-4 lg:grid-cols-4 xl:grid-cols-6'>
                    {list &&
                        list.map((card) => (
                            <div
                                key={card.id}
                                class='cursor-pointer transition-transform duration-200 hover:scale-120'
                            >
                                <img
                                    src='bg.jpg'
                                    alt={card.name}
                                    class='w-full rounded'
                                    onClick={() => setCardInfo(card)}
                                />
                            </div>
                        ))}
                </div>
            )}
            {!isGridView && (
                <div class='flex flex-col gap-4 px-4 pb-4'>
                    {list.map((card) => {
                        return (
                            <div
                                key={card.id}
                                class='grid cursor-pointer grid-cols-[4rem_1fr] grid-rows-[auto_auto_1fr] gap-2 truncate rounded bg-slate-700 p-2 hover:bg-slate-600 xl:grid-cols-[6rem_1fr]'
                                onClick={() => setCardInfo(card)}
                            >
                                <img
                                    src='bg.jpg'
                                    alt={card.name}
                                    class='row-span-3 rounded xl:row-span-4'
                                />
                                <div class='text-lg'>{card.name}</div>
                                <div class='flex gap-1.5 xl:gap-3'>
                                    <img
                                        src={
                                            attributeIconsImport[
                                                `../assets/attributes/${card.attribute}.svg`
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
                                        Small World Connections (
                                        {card.links.length}){' '}
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
                        );
                    })}
                </div>
            )}
        </>
    );
}
// [text-shadow:-2px_1px_2px_rgba(0,0,0,0.8)]
