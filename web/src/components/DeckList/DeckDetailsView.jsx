import { Minus } from 'lucide-preact';
import { Button } from '../';
import { CardListItem } from './CardListItem';

const attributeIconsImport = import.meta.glob('../../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function DeckDetailsView({ list, isRemoving, onCardClick }) {
    return (
        <div class='flex flex-col gap-4 p-4' data-ignore-outside-clicks='true'>
            {list.map((card) => (
                <div key={card.id} class='flex'>
                    <div
                        class={`overflow-hidden transition-all duration-300 ease-in-out ${isRemoving ? 'w-12 pr-2' : 'w-0 pr-0'}`}
                    >
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => onCardClick(card)}
                        >
                            <Minus />
                        </Button>
                    </div>
                    <CardListItem
                        card={card}
                        isRemoving={isRemoving}
                        onCardClick={onCardClick}
                    />
                </div>
            ))}
        </div>
    );
}
