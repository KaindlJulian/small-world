import { useCardInfo, useOnClickOutside, useSearcher } from '@/hooks';
import {
    ArrowDownNarrowWide,
    ArrowDownWideNarrow,
    LayoutGrid,
    List,
} from 'lucide-preact';
import { useMemo, useState } from 'react';
import { Button, Combobox, Modal } from '../';
import { DeckDetailsView } from './DeckDetailsView';
import { DeckGridView } from './DeckGridView';

const sortOptions = [
    { id: 'name', text: 'Name' },
    { id: 'level', text: 'Level' },
    { id: 'atk', text: 'ATK' },
    { id: 'def', text: 'DEF' },
    { id: 'links', text: 'Targets' },
];

export function DeckList({ cards, onRemoveCard, onAddCard }) {
    const [view, setView] = useState({
        grid: true,
        removing: false,
        modal: false,
    });
    const [sortConfig, setSortConfig] = useState({ key: 'links', desc: true });

    const { setCardInfo } = useCardInfo();
    const { searcher, isSearcherLoading } = useSearcher();

    useOnClickOutside(
        () => {
            if (view.removing) {
                console.log('set remove false');
                setView((prev) => ({ ...prev, removing: false }));
            }
        },
        { ignoreAttribute: 'data-ignore-outside-clicks' },
    );

    const handleCardClick = (card) => {
        if (view.removing) {
            onRemoveCard(card);
        } else {
            setCardInfo(card);
        }
    };

    const sortedCards = useMemo(() => {
        if (!cards) return [];

        return [...cards].sort((cardA, cardB) => {
            const { key, desc } = sortConfig;
            let a = cardA[key];
            let b = cardB[key];

            if (key === 'links') {
                a = cardA.links.length;
                b = cardB.links.length;
            }

            let comparison = 0;
            if (typeof a === 'string') {
                comparison = a.localeCompare(b);
            } else {
                comparison = a - b;
            }

            return desc ? -comparison : comparison;
        });
    }, [cards, sortConfig]);

    if (!cards || isSearcherLoading) return null;

    const names = searcher
        .get_all()
        .map((m) => ({ id: m.id, text: m.name_wasm }))
        .sort((a, b) => a.text.localeCompare(b.text));

    return (
        <>
            <Modal
                isOpen={view.modal}
                onClose={() => setView((prev) => ({ ...prev, modal: false }))}
                title='Search a Card'
                className='flex h-85 flex-col'
            >
                <Combobox
                    items={names}
                    placeholder='Search a Card...'
                    onSelect={(item) => {
                        const card = searcher.get_by_id(item.id);
                        onAddCard(card);
                        setView((prev) => ({ ...prev, modal: false }));
                    }}
                ></Combobox>
                <div class='grow'></div>
                <div class='mt-4 flex justify-end gap-2'>
                    <Button
                        variant='secondary'
                        onClick={() =>
                            setView((prev) => ({ ...prev, modal: false }))
                        }
                    >
                        Cancel
                    </Button>
                    <Button variant='primary'>Add Card</Button>
                </div>
            </Modal>
            <div class='sticky top-0 z-50 flex w-full gap-2 bg-slate-800 p-4'>
                <Button
                    onClick={() =>
                        setView((prev) => ({ ...prev, modal: true }))
                    }
                >
                    Add
                </Button>
                <Button
                    variant={view.removing ? 'destructive' : 'secondary'}
                    onClick={() =>
                        setView((prev) => ({
                            ...prev,
                            removing: !prev.removing,
                        }))
                    }
                    data-ignore-outside-clicks='true'
                >
                    {view.removing ? 'Cancel' : 'Remove'}
                </Button>

                <Button
                    variant='secondary'
                    size='icon'
                    onClick={() =>
                        setView((prev) => ({ ...prev, grid: !prev.grid }))
                    }
                    data-ignore-outside-clicks='true'
                >
                    {view.grid ? <List /> : <LayoutGrid />}
                </Button>

                <div class='grow' />
                <Combobox
                    items={sortOptions}
                    placeholder='Sort by...'
                    filterable={false}
                    onSelect={(item) => {
                        setSortConfig((prev) => ({ ...prev, key: item.id }));
                    }}
                ></Combobox>
                <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => {
                        setSortConfig((prev) => ({
                            ...prev,
                            desc: !prev.desc,
                        }));
                    }}
                >
                    {sortConfig.desc ? (
                        <ArrowDownWideNarrow />
                    ) : (
                        <ArrowDownNarrowWide />
                    )}
                </Button>
            </div>

            {view.grid ? (
                <DeckGridView
                    list={sortedCards}
                    isRemoving={view.removing}
                    onCardClick={handleCardClick}
                />
            ) : (
                <DeckDetailsView
                    list={sortedCards}
                    isRemoving={view.removing}
                    onCardClick={handleCardClick}
                />
            )}
        </>
    );
}
