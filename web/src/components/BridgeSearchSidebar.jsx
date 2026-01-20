import { useCardInfo } from '@/hooks';
import { VirtuosoGrid } from 'react-virtuoso';
import { CardFilter, LoadingSpinner, MultiCombobox } from '.';

export function BridgeSearchSidebar({
    searchOptions,
    inHandList,
    setInHandList,
    targetList,
    setTargetList,
    filteredCards,
    isLoading,
    isIdle,
    onFilterChange,
}) {
    const { setCardInfo } = useCardInfo();

    return (
        <div class='flex h-full flex-col overflow-hidden'>
            <div class='sticky top-0 z-10 flex flex-col gap-4 bg-slate-800 p-4 shadow-md'>
                <div class='text-lg font-semibold'>Find Bridges</div>
                <MultiCombobox
                    items={searchOptions}
                    placeholder='Select in hand'
                    onSelect={setInHandList}
                    filter={(item) => !targetList.some((t) => t.id === item.id)}
                />
                <MultiCombobox
                    items={searchOptions}
                    placeholder='Select targets'
                    onSelect={setTargetList}
                    filter={(item) => !inHandList.some((i) => i.id === item.id)}
                />
            </div>

            {isIdle && (
                <div class='m-auto text-slate-400'>
                    Select cards in hand and target cards to find bridging
                    cards.
                </div>
            )}

            {isLoading && <LoadingSpinner text='Loading bridge cards' />}

            {filteredCards && (
                <VirtuosoGrid
                    style={{ height: '100%' }}
                    listClassName='grid grid-cols-6 gap-2 px-4 mt-4'
                    data={filteredCards}
                    itemContent={(index, card) => (
                        <div class=''>
                            <img
                                class='h-full w-full cursor-pointer rounded-md transition-transform hover:z-10 hover:scale-120'
                                src={`bg.jpg`}
                                alt={card.name}
                                onClick={() => setCardInfo(card)}
                                loading='lazy'
                            />
                        </div>
                    )}
                />
            )}

            {filteredCards && (
                <div class='animate-slide-in-bottom bg-slate-800 p-4 shadow-md'>
                    <div class='flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400 uppercase'>
                        <span>Filter Cards</span>
                        <span>{filteredCards.length} Bridges Found</span>
                    </div>
                    <div class='mt-2 flex flex-col gap-2'>
                        <CardFilter onFilterChange={onFilterChange} />
                    </div>
                </div>
            )}
        </div>
    );
}
