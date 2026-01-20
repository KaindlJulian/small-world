import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { fetchCards, mapToCard } from '../api/ygoprodeck.js';
import {
    BridgeGraph,
    CardFilter,
    CardInfo,
    MultiCombobox,
    Sidebar,
} from '../components';
import { useCardInfo, useSearcher } from '../hooks';

export function BridgeExplore() {
    const { searcher, isSearcherLoading } = useSearcher();
    const { setCardInfo } = useCardInfo();
    const [inHandList, setInHandList] = useState([]);
    const [targetList, setTargetList] = useState([]);
    const [resultCards, setResultCards] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        if (inHandList.length === 0 || targetList.length === 0) {
            setResultCards([]);
            return;
        }

        if (searcher && inHandList.length > 0 && targetList.length > 0) {
            const commonBridges = searcher.find_common_bridges(
                inHandList.map((item) => item.id),
                targetList.map((item) => item.id),
            );

            commonBridges.sort((a, b) =>
                a.name_wasm.localeCompare(b.name_wasm),
            );

            const cards = commonBridges.map((c) => ({
                id: c.id,
                passcode: c.passcode,
                name: c.name_wasm,
                attribute: c.attribute,
                level: c.level,
                properties: [c.type],
                text: c.desc,
                atk: c.atk,
                def: c.def,
                frame: '',
            }));

            setResultCards(Array.from(cards));
        }
    }, [inHandList, targetList]);

    if (isSearcherLoading) {
        <LoadingSpinner text='Loading engine' />;
    }

    const bridgeQuery = useQuery({
        queryKey: ['bridges-full', resultCards.map((c) => c.passcode)],
        enabled: Array.isArray(resultCards) && resultCards.length > 0,
        queryFn: () => fetchCards(resultCards.map((c) => c.passcode)),
        retry: false,
    });

    const apiMap = useMemo(() => {
        if (!bridgeQuery.data) return null;
        return new Map(bridgeQuery.data.map((c) => [c.id, mapToCard(c)]));
    }, [bridgeQuery.data]);

    const filteredCards = useMemo(() => {
        if (!apiMap) {
            return null;
        }

        if (!activeFilter) {
            return resultCards.map((wasmCard) => apiMap.get(wasmCard.passcode));
        }

        return resultCards
            .map((wasmCard) => apiMap.get(wasmCard.passcode))
            .filter((card) => {
                if (activeFilter.attributes.length > 0) {
                    if (!activeFilter.attributes.includes(card.attribute)) {
                        return false;
                    }
                }

                if (activeFilter.types.length > 0) {
                    if (
                        !card.properties.some((prop) =>
                            activeFilter.types.includes(prop),
                        )
                    ) {
                        return false;
                    }
                }

                if (activeFilter.levels.length > 0) {
                    if (!activeFilter.levels.includes(card.level)) return false;
                }

                if (
                    activeFilter.minATK !== null &&
                    card.atk < activeFilter.minATK
                )
                    return false;
                if (
                    activeFilter.maxATK !== null &&
                    card.atk > activeFilter.maxATK
                )
                    return false;
                if (
                    activeFilter.minDEF !== null &&
                    card.def < activeFilter.minDEF
                )
                    return false;
                if (
                    activeFilter.maxDEF !== null &&
                    card.def > activeFilter.maxDEF
                )
                    return false;

                return true;
            });
    }, [activeFilter, apiMap]);

    const names = searcher
        .get_all()
        .map((m) => ({ id: m.id, text: m.name_wasm }))
        .sort((a, b) => a.text.localeCompare(b.text));

    return (
        <div class='grid h-full divide-slate-700 lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]'>
            <CardInfo />
            <div class='flex w-full flex-col'>
                {filteredCards && (
                    <BridgeGraph
                        sources={inHandList}
                        targets={targetList}
                        bridges={filteredCards}
                    />
                )}
            </div>
            <Sidebar>
                <div class='flex h-full flex-col overflow-hidden'>
                    <div class='sticky top-0 z-10 flex flex-col gap-4 bg-slate-800 p-4 shadow-md'>
                        <div class='text-lg font-semibold'>Find Bridges</div>
                        <MultiCombobox
                            items={names}
                            placeholder='Select in hand'
                            onSelect={(items) => {
                                setInHandList(items);
                            }}
                            filter={(item) =>
                                !targetList.some((t) => t.id === item.id)
                            }
                        />
                        <MultiCombobox
                            items={names}
                            placeholder='Select targets'
                            onSelect={(items) => {
                                setTargetList(items);
                            }}
                            filter={(item) =>
                                !inHandList.some((i) => i.id === item.id)
                            }
                        />
                    </div>
                    {!filteredCards && !bridgeQuery.isEnabled && (
                        <div class='m-auto text-slate-400'>
                            Select cards in hand and target cards to find
                            bridging cards.
                        </div>
                    )}
                    {!filteredCards && bridgeQuery.isLoading && (
                        <LoadingSpinner text='Loading bridge cards' />
                    )}
                    {filteredCards && (
                        <VirtuosoGrid
                            style={{ height: '100%' }}
                            listClassName='grid grid-cols-6 gap-2 px-4 mt-4'
                            data={filteredCards}
                            itemContent={(index, card) => {
                                return (
                                    <div class=''>
                                        <img
                                            class='h-full w-full cursor-pointer rounded-md transition-transform hover:z-10 hover:scale-120'
                                            src={`bg.jpg`}
                                            alt={card.name}
                                            onClick={() => setCardInfo(card)}
                                            loading='lazy'
                                        />
                                    </div>
                                );
                            }}
                        />
                    )}
                    {filteredCards && (
                        <div class='animate-slide-in-bottom bg-slate-800 p-4 shadow-md'>
                            <div class='flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400 uppercase'>
                                <span>Filter Cards</span>
                                <span>
                                    {filteredCards.length} Bridges Found
                                </span>
                            </div>
                            <div class='mt-2 flex flex-col gap-2'>
                                <CardFilter
                                    onFilterChange={(filter) => {
                                        setActiveFilter(filter);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Sidebar>
        </div>
    );
}
