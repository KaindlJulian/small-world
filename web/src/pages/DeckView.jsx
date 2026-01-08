import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchCards } from '../api/ygoprodeck.js';
import {
    CardInfo,
    DeckInput,
    DeckList,
    ForceGraph,
    Sidebar,
} from '../components';
import { Card } from '../core/Card.js';
import { useCardInfo, useGraphData, useSearcher } from '../hooks';

export function DeckView() {
    const [deckIds, setDeckIds] = useState(null);
    const { searcher, isSearcherLoading } = useSearcher();
    const { closeCard, setCardInfo } = useCardInfo();

    const deckQuery = useQuery({
        queryKey: ['deck', deckIds],
        queryFn: () => fetchCards(deckIds),
        enabled: Array.isArray(deckIds),
        select: (data) =>
            data
                .filter((cardData) => cardData.type.includes('Monster'))
                .map(
                    (cardData) =>
                        new Card(
                            cardData.misc_info[0].konami_id,
                            cardData.id,
                            cardData.name,
                            cardData.attribute,
                            cardData.level,
                            cardData.typeline,
                            cardData.desc,
                            cardData.atk,
                            cardData.def,
                            cardData.frameType,
                        ),
                ),
    });

    const { nodes, links } = useGraphData(deckQuery.data, searcher);

    const handleInput = (cardList) => {
        setDeckIds(cardList);
    };

    if (deckQuery.isLoading || isSearcherLoading) {
        return <div>Loading…</div>;
    }

    if (deckQuery.isError) {
        return <div>Error loading cards</div>;
    }

    // cards of the deck including small world connections
    const cards = nodes;

    if (cards && searcher) {
        const bridges = searcher.find_bridges_ids(cards.map((card) => card.id));
    }

    return (
        <div class='grid h-full divide-slate-600 lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]'>
            <CardInfo />
            <div
                onClick={closeCard}
                class='flex flex-col items-center justify-center'
            >
                {deckIds === null && (
                    <>
                        <DeckInput
                            onInput={(cardList) => handleInput(cardList)}
                        ></DeckInput>
                        <div class='my-4 flex w-full max-w-sm items-center justify-center gap-3 text-slate-400'>
                            <span class='text-xs tracking-wide'>OR</span>
                        </div>
                        <button
                            onClick={() => handleInput([])}
                            class='cursor-pointer rounded bg-slate-700 px-4 py-2 font-bold hover:bg-slate-600'
                        >
                            Start with an Empty Deck
                        </button>
                    </>
                )}
                {deckIds !== null && (
                    <ForceGraph
                        nodes={nodes}
                        links={links}
                        setCardInfo={setCardInfo}
                    />
                )}
            </div>
            <Sidebar class='col-span-2 lg:col-span-1'>
                <DeckList cards={cards} setCardInfo={setCardInfo} />
            </Sidebar>
        </div>
    );
}
