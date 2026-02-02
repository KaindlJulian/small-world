import { useBridgeSearch } from '@/hooks';
import {
    BridgeGraph,
    BridgeSearchSidebar,
    CardInfo,
    Sidebar,
} from '../components';

export function BridgeExplore() {
    const bridgeSearch = useBridgeSearch();

    if (bridgeSearch.isEngineLoading) {
        return <div class='p-10'>Loading engine...</div>;
    }

    return (
        <div class='grid h-full divide-zinc-700 lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]'>
            <CardInfo />

            <div class='flex w-full flex-col'>
                {bridgeSearch.filteredCards.length > 0 ? (
                    <BridgeGraph
                        sources={bridgeSearch.inHandList}
                        targets={bridgeSearch.targetList}
                        bridges={bridgeSearch.filteredCards}
                    />
                ) : (
                    <>
                        <div class='m-auto flex flex-col items-center gap-4 text-center'>
                            <h2 class='text-2xl font-bold'>
                                Start Exploring Bridges
                            </h2>
                            <p class='max-w-md text-zinc-400'>
                                Use the sidebar to filter and search for bridge
                                cards based on your in-hand and target cards.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <Sidebar>
                <BridgeSearchSidebar
                    searchOptions={bridgeSearch.searchOptions}
                    inHandList={bridgeSearch.inHandList}
                    setInHandList={bridgeSearch.setInHandList}
                    targetList={bridgeSearch.targetList}
                    setTargetList={bridgeSearch.setTargetList}
                    filteredCards={bridgeSearch.filteredCards}
                    onFilterChange={bridgeSearch.setActiveFilter}
                />
            </Sidebar>
        </div>
    );
}
