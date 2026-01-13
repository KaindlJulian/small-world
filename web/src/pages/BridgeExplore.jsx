import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
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

    useEffect(() => {
        if (inHandList === 0 || targetList.length === 0) {
            setResultCards([]);
            return;
        }

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
                atk: c.atk,
                def: c.def,
                frame: '',
            }));

            setResultCards(Array.from(cards));
        }
    }, [inHandList, targetList]);

    if (isSearcherLoading) {
        return <div>Loading…</div>;
    }

    const bridgeQuery = useQuery({
        queryKey: ['bridges-full', resultCards.map((c) => c.passcode)],
        enabled: Array.isArray(resultCards) && resultCards.length > 0,
        queryFn: () => fetchCards(resultCards.map((c) => c.passcode)),
        retry: false,
    });

    const apiMap = useMemo(() => {
        if (!bridgeQuery.data) return new Map();
        return new Map(
            bridgeQuery.data.map((c) => [String(c.id), mapToCard(c)]),
        );
    }, [bridgeQuery.data]);

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
                    <VirtuosoGrid
                        style={{ height: '100%' }}
                        listClassName='grid grid-cols-6 gap-2 px-4 mt-4'
                        totalCount={resultCards.length}
                        data={resultCards}
                        itemContent={(index, wasmCard) => {
                            const apiData = apiMap.get(
                                String(wasmCard.passcode),
                            );

                            if (!apiData) {
                                return (
                                    <div class='flex aspect-[1/1.45] w-full animate-pulse items-center justify-center overflow-hidden rounded-md border border-slate-700 bg-slate-800 p-2'>
                                        <span class='text-center leading-tight font-medium text-slate-500 select-none'>
                                            {wasmCard.name}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div class=''>
                                    <img
                                        class='h-full w-full cursor-pointer rounded-md transition-transform hover:z-10 hover:scale-120'
                                        src={`bg.jpg`}
                                        alt={apiData.name}
                                        onClick={() => setCardInfo(apiData)}
                                        loading='lazy'
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
