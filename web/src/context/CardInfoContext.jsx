import { createContext, useState } from 'react';

export const CardInfoContext = createContext();

export function CardInfoProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [card, setCard] = useState(null);

    const openCard = () => setIsOpen(true);
    const closeCard = () => setIsOpen(false);
    const setCardInfo = (cardInfo) => {
        setCard(cardInfo);
        setIsOpen(true);
    };

    return (
        <CardInfoContext.Provider
            value={{ isOpen, card, openCard, closeCard, setCardInfo }}
        >
            {children}
        </CardInfoContext.Provider>
    );
}
