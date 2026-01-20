import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { fetchCards, mapToCard } from '../api/ygoprodeck.js';
import { useSearcher } from './index.js';

export function useBridgeSearch() {
    const { searcher, isSearcherLoading } = useSearcher();

    const [inHandList, setInHandList] = useState([]);
    const [targetList, setTargetList] = useState([]);
    const [resultCards, setResultCards] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);

    // find common bridges (wasm)
    useEffect(() => {
        if (!searcher || inHandList.length === 0 || targetList.length === 0) {
            setResultCards([]);
            return;
        }

        const commonBridges = searcher.find_common_bridges(
            inHandList.map((item) => item.id),
            targetList.map((item) => item.id),
        );

        commonBridges.sort((a, b) => a.name_wasm.localeCompare(b.name_wasm));

        const cards = commonBridges.map((c) => ({
            id: c.id,
            name: c.name_wasm,
            attribute: c.attribute,
            level: c.level,
            properties: [c.type],
            atk: c.atk,
            def: c.def,
        }));

        setResultCards(cards);
    }, [searcher, inHandList, targetList]);

    const bridgeQuery = useQuery({
        queryKey: ['bridges-full', resultCards.map((c) => c.id)],
        enabled: resultCards.length > 0,
        queryFn: () => fetchCards(resultCards.map((c) => c.id)),
        retry: false,
    });

    // to hydrate wasm cards with full api data on the fly
    const apiMap = useMemo(() => {
        if (!bridgeQuery.data) return null;
        return new Map(bridgeQuery.data.map((c) => [c.id, mapToCard(c)]));
    }, [bridgeQuery.data]);

    // apply filters and hydrate wasm cards
    const filteredCards = useMemo(() => {
        if (!apiMap) {
            return null;
        }

        if (!activeFilter) {
            return resultCards.map((wasmCard) => apiMap.get(wasmCard.id));
        }

        return resultCards
            .map((wasmCard) => apiMap.get(wasmCard.id))
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

    const searchOptions = useMemo(() => {
        if (!searcher) return [];
        return searcher
            .get_all()
            .map((m) => ({ id: m.id, text: m.name_wasm }))
            .sort((a, b) => a.text.localeCompare(b.text));
    }, [searcher]);

    return {
        inHandList,
        setInHandList,
        targetList,
        setTargetList,
        activeFilter,
        setActiveFilter,

        filteredCards,
        searchOptions,

        isEngineLoading: isSearcherLoading,
        isDataLoading: bridgeQuery.isLoading,
        isIdle: !filteredCards && !bridgeQuery.isEnabled,
    };
}
