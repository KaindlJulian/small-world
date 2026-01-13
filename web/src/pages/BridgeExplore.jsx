import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { fetchCards, mapToCard } from '../api/ygoprodeck.js';
import { CardInfo, MultiCombobox, Sidebar } from '../components';
import { useCardInfo, useSearcher } from '../hooks';

export function BridgeExplore() {
    const { searcher, isSearcherLoading } = useSearcher();
    const { setCardInfo } = useCardInfo();
    const [inHandList, setInHandList] = useState([]);
    const [targetList, setTargetList] = useState([]);
    const [resultCards, setResultCards] = useState([]);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        if (searcher && inHandList.length > 0 && targetList.length > 0) {
            const commonBridges = searcher.find_common_bridges_ids(
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
                atk: c.atk ? c.atk : '?',
                def: c.def ? c.def : '?',
                frame: '',
            }));

            setResultCards(Array.from(cards));
        }
    }, [inHandList, targetList]);

    if (isSearcherLoading) {
        return <div>Loading…</div>;
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['bridges', resultCards.map((c) => c.passcode)],
        enabled: Array.isArray(resultCards) && resultCards.length > 0,
        initialPageParam: 0,
        queryFn: async ({ pageParam = 0 }) => {
            const pageSize = 50;
            const chunk = resultCards.slice(pageParam, pageParam + pageSize);
            const rawData = await fetchCards(chunk.map((c) => c.passcode));
            return rawData.map(mapToCard);
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            const prevParam = firstPageParam - 50;
            return prevParam >= 0 ? prevParam : undefined;
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            const nextParam = lastPageParam + 50;
            return nextParam < resultCards.length ? nextParam : undefined;
        },
    });

    const allVisibleCards = data?.pages.flat() || [];

    const names = searcher
        .get_all()
        .map((m) => ({ id: m.id, text: m.name_wasm }))
        .sort((a, b) => a.text.localeCompare(b.text));

    return (
        <div class='grid h-full divide-slate-700 lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]'>
            <CardInfo />
            <div class='flex w-full flex-col'>aa</div>
            <Sidebar>
                <div class='flex h-full flex-col'>
                    <div class='sticky top-0 z-10 flex flex-col gap-4 bg-slate-800 p-4 shadow-md'>
                        <div class='text-lg font-semibold'>Find Bridges</div>
                        <MultiCombobox
                            items={names}
                            placeholder='Select in hand'
                            onSelect={(items) => {
                                setInHandList([...inHandList, ...items]);
                            }}
                        />
                        <MultiCombobox
                            items={names}
                            placeholder='Select targets'
                            onSelect={(items) => {
                                setTargetList([...targetList, ...items]);
                            }}
                        />
                    </div>
                    <VirtuosoGrid
                        style={{ height: '100%' }}
                        listClassName='grid grid-cols-6 gap-2 px-4 mt-4'
                        totalCount={resultCards.length}
                        data={resultCards}
                        rangeChanged={(range) => {
                            // Load more when two rows from the bottom
                            if (range.endIndex > allVisibleCards.length - 12) {
                                if (hasNextPage && !isFetchingNextPage)
                                    fetchNextPage();
                            }
                        }}
                        isScrolling={setIsScrolling}
                        increaseViewportBy={400}
                        context={{ isScrolling }}
                        itemContent={(index, card, context) => {
                            const cardData = allVisibleCards[index];

                            if (
                                !cardData ||
                                (context.isScrolling && !cardData)
                            ) {
                                return (
                                    <div class='h-34 animate-pulse overflow-hidden rounded-md bg-slate-700 p-1'>
                                        {card.name}
                                    </div>
                                );
                            }

                            return (
                                <div key={card.id} class=''>
                                    <img
                                        class='h-34 cursor-pointer rounded-md transition-transform hover:z-10 hover:scale-120'
                                        src={`bg.jpg`}
                                        alt={card.name}
                                        onClick={() => setCardInfo(cardData)}
                                    />
                                </div>
                            );
                        }}
                    />
                    <div class='h-24 bg-slate-800 p-4 shadow-md'>
                        <div class='text-lg font-semibold'>
                            Filter Cards, total {resultCards.length} cards
                        </div>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}
