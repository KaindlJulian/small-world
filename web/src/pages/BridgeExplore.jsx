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
                {bridgeSearch.filteredCards && (
                    <BridgeGraph
                        sources={bridgeSearch.inHandList}
                        targets={bridgeSearch.targetList}
                        bridges={bridgeSearch.filteredCards}
                    />
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
                    isLoading={bridgeSearch.isDataLoading}
                    isIdle={bridgeSearch.isIdle}
                    onFilterChange={bridgeSearch.setActiveFilter}
                />
            </Sidebar>
        </div>
    );
}
