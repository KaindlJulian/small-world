import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { fetchCards } from '../api/ygoprodeck.js';
import { CardInfo } from '../components/CardInfo.jsx';
import { DeckInput } from '../components/DeckInput.jsx';
import { ForceGraph } from '../components/ForceGraph.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { CardInfoContext } from '../context/CardInfoContext.jsx';
import { Card } from '../core/Card.js';
import { useSearcher } from '../hooks/useSearcher.js';
import { decode_ydke, parse_ydk } from '../wasm/index.js';

const nodes = [
    { id: '1', name: 'Monster 1' },
    { id: '2', name: 'Monster 2' },
    { id: '3', name: 'Monster 3' },
];

const links = [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
];

const card = new Card(
    55697723,
    'Surfacing Big Jaws',
    'WATER',
    4,
    ['Fish', 'Effect'],
    `If this card is used for the Xyz Summon of a WATER monster, it can be treated as a Level 3 or 5 monster.
You can only use each of the following effects of "Surfacing Big Jaws" once per turn.
During your Main Phase, if a Spell Card was activated this turn: You can Special Summon this card from your hand, also you cannot Special Summon from the Extra Deck for the rest of this turn, except Xyz Monsters.
If this card is Normal or Special Summoned: You can add 1 Fish "Shark" monster from your Deck to your hand.`,
    1800,
    300,
);

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export function DeckView() {
    const [deckIds, setDeckIds] = useState(null);
    const { searcher, isLoading } = useSearcher();
    const { closeCard, setCardInfo } = useContext(CardInfoContext);

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
                        ),
                ),
    });

    const handleInput = async (data) => {
        try {
            let cardList = [];
            if (data instanceof File) {
                const text = await readFileAsText(data);
                cardList = parse_ydk(text, true);
            } else if (typeof data === 'string') {
                cardList = data.startsWith('ydke://')
                    ? decode_ydke(data, true)
                    : parse_ydk(data, true);
            }
            cardList = [...new Set(cardList)];
            setDeckIds(cardList);
        } catch (error) {
            console.error('Error processing data:', error);
        }
    };

    if (deckQuery.isLoading) {
        return <div>Loading cards…</div>;
    }

    if (deckQuery.isError) {
        return <div>Error loading cards</div>;
    }

    if (isLoading) {
        return <div>Loading searcher…</div>;
    }

    let cards = deckQuery.data;

    if (cards && searcher) {
        const bridges = searcher.find_bridges_ids(cards.map((card) => card.id));
        console.log(bridges);
    }

    return (
        <div class='grid h-full divide-x divide-slate-600 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_650px]'>
            <CardInfo />
            <div
                onClick={closeCard}
                class='flex flex-col items-center justify-center'
            >
                {deckIds === null && (
                    <>
                        <DeckInput
                            onFile={(file) => handleInput(file[0])}
                            onText={(text) => handleInput(text)}
                        ></DeckInput>
                        <div class='my-4 flex w-full max-w-sm items-center justify-center gap-3 text-slate-400'>
                            <span class='text-xs tracking-wide'>OR</span>
                        </div>
                        <button
                            onClick={() => {
                                setDeckIds([]);
                            }}
                            class='cursor-pointer rounded bg-slate-700 px-4 py-2 font-bold hover:bg-slate-600'
                        >
                            Start with an Empty Deck
                        </button>
                    </>
                )}
                {deckIds !== null && <ForceGraph nodes={nodes} links={links} />}
            </div>
            <Sidebar class='lg:col-span-2' />
        </div>
    );
}
