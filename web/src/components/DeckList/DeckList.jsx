import { useCardInfo } from '@/hooks';
import { ArrowDownNarrowWide, LayoutGrid, List } from 'lucide-preact';
import { useEffect, useState } from 'preact/hooks';
import { Button } from '../';
import { DeckDetailsView } from './DeckDetailsView';
import { DeckGridView } from './DeckGridView';

export function DeckList({ cards, onRemoveCard }) {
    const [isGridView, setIsGridView] = useState(true);
    const [isRemovingCards, setIsRemovingCards] = useState(false);
    const { setCardInfo } = useCardInfo();

    const handleCardClick = (card, forceDelete = false) => {
        if (isRemovingCards || forceDelete) {
            onRemoveCard(card);
        } else {
            setCardInfo(card);
        }
    };

    useEffect(() => {
        if (!isRemovingCards) return;

        const handleGlobalClick = (event) => {
            if (event.target.closest('.deck-container')) return;
            if (event.target.closest('.remove-toggle-btn')) return;
            setIsRemovingCards(false);
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [isRemovingCards]);

    if (!cards) return null;

    return (
        <>
            <div class='sticky top-0 z-50 flex w-full gap-2 bg-slate-800 p-4'>
                <Button onClick={() => {}}>Add</Button>
                <Button
                    class='remove-toggle-btn'
                    variant={isRemovingCards ? 'destructive' : 'secondary'}
                    onClick={() => setIsRemovingCards(!isRemovingCards)}
                >
                    {isRemovingCards ? 'Cancel' : 'Remove'}
                </Button>
                <div class='grow' />
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsGridView(!isGridView)}
                >
                    {isGridView ? <List /> : <LayoutGrid />}
                </Button>
                <Button variant='ghost' size='icon'>
                    <ArrowDownNarrowWide />
                </Button>
            </div>

            {isGridView ? (
                <DeckGridView
                    list={cards}
                    isRemovingCards={isRemovingCards}
                    onCardClick={handleCardClick}
                />
            ) : (
                <DeckDetailsView
                    list={cards}
                    isRemovingCards={isRemovingCards}
                    onCardClick={handleCardClick}
                />
            )}
        </>
    );
}
