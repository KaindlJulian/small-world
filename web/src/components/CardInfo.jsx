import { useContext } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { CardInfoContext } from '../context/CardInfoContext';
import levelIcon from '../assets/level_star.svg';

const attributeIconsImport = import.meta.glob('../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function CardInfo() {
    let { isOpen, card, openCard, closeCard } = useContext(CardInfoContext);

    if (!card) {
        return null;
    }

    const attributeIcons = Object.fromEntries(
        Object.entries(attributeIconsImport).map(([path, mod]) => {
            const name = path.split('/').pop()?.replace('.svg', '');
            return [name, mod];
        }),
    );

    return (
        <>
            <div
                class={`fixed left-0 flex h-[calc(100%-48px)] flex-col bg-slate-800 transition-transform duration-250 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } z-50 w-72`}
            >
                <button
                    onClick={() => (isOpen ? closeCard() : openCard())}
                    class='absolute top-1/2 -right-14 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-all duration-250 hover:bg-slate-600 hover:shadow-lg'
                >
                    <ChevronLeftIcon
                        class={`h-6 w-6 transform transition-transform duration-250 ${
                            !isOpen && '-scale-x-100'
                        }`}
                    />
                </button>

                <aside class='flex h-full flex-col pb-4'>
                    <div class='mb-2 bg-amber-700 py-2 text-center'>
                        <h2 class='px-4 text-lg'>{card.name}</h2>
                    </div>
                    <div class='grid grid-cols-2 gap-2 overflow-hidden px-4'>
                        <img
                            src='card.webp'
                            alt='card'
                            class='col-span-2 rounded-sm'
                        />
                        <div class='flex cursor-pointer items-center rounded-sm bg-slate-700 px-2 py-2 hover:bg-slate-600'>
                            <img
                                src={attributeIcons[card.attribute]}
                                alt={`Attribute ${card.attribute}`}
                                class='mr-4 inline h-6 w-6'
                            />
                            <span>{card.attribute}</span>
                        </div>
                        <div class='flex cursor-pointer items-center rounded-sm bg-slate-700 px-2 py-2 hover:bg-slate-600'>
                            <img
                                src={levelIcon}
                                alt='Level'
                                class='mr-4 inline h-6 w-6'
                            />
                            <span>{card.level}</span>
                        </div>
                        <div class='flex cursor-pointer items-center rounded-sm bg-slate-700 px-2 py-2 hover:bg-slate-600'>
                            <div class='mr-2 h-6 w-8'>
                                <span class='font-bold'>ATK</span>
                                <span>/</span>
                            </div>
                            <span>{card.atk}</span>
                        </div>
                        <div class='flex cursor-pointer items-center rounded-sm bg-slate-700 px-2 py-2 hover:bg-slate-600'>
                            <div class='mr-2 h-6 w-8'>
                                <span class='font-bold'>DEF</span>
                                <span>/</span>
                            </div>
                            <span>{card.def}</span>
                        </div>
                        <div class='col-span-2 flex cursor-pointer items-center rounded-sm bg-slate-700 px-2 py-2 hover:bg-slate-600'>
                            <span class='font-bold'>
                                [ {card.properties.join(' / ')} ]
                            </span>
                        </div>
                        <div class='col-span-2 overflow-hidden rounded-sm bg-gray-900 px-2 [scrollbar-gutter:stable] hover:overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full'>
                            <span class='justify-text inline-block tracking-[0.1px] select-text'>
                                {card.text}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
