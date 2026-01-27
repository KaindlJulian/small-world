import { useEffect, useMemo, useState } from 'react';
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

        commonBridges.sort((a, b) => a.name_js.localeCompare(b.name_js));

        const cards = commonBridges.map((c) => ({
            id: c.id,
            name: c.name_js,
            attribute: c.attribute_js,
            level: c.level,
            properties: [c.type_js],
            atk: c.atk,
            def: c.def,
        }));

        setResultCards(cards);
    }, [searcher, inHandList, targetList]);

    // apply filters
    const filteredCards = useMemo(() => {
        if (!activeFilter) {
            return resultCards;
        }

        return resultCards.filter((card) => {
            if (!card) return false;

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
                if (!activeFilter.levels.includes(card.level))
                    return false;
            }

            if (activeFilter.minATK !== null && card.atk < activeFilter.minATK)
                return false;
            if (activeFilter.maxATK !== null && card.atk > activeFilter.maxATK)
                return false;
            if (activeFilter.minDEF !== null && card.def < activeFilter.minDEF)
                return false;
            if (activeFilter.maxDEF !== null && card.def > activeFilter.maxDEF)
                return false;

            return true;
        });
    }, [activeFilter, resultCards]);

    const searchOptions = useMemo(() => {
        if (!searcher) return [];
        return searcher
            .get_all()
            .map((m) => ({ id: m.id, text: m.name_js }))
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
    };
}
