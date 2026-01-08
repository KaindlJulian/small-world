import { useSignal } from '@preact/signals';
import { createContext } from 'react';

export const CardInfoContext = createContext();

export function CardInfoProvider({ children }) {
    const cardSignal = useSignal(null);
    const isOpenSignal = useSignal(false);
    const isAutoOpen = useSignal(true);

    const value = {
        cardSignal,
        isOpenSignal,
        openCard: () => {
            isOpenSignal.value = true;
        },
        closeCard: () => {
            isOpenSignal.value = false;
        },
        setIsAutoOpen: (value) => {
            isAutoOpen.value = value;
        },
        setCardInfo: (cardInfo) => {
            cardSignal.value = cardInfo;
            if (isAutoOpen.value) {
                isOpenSignal.value = true;
            }
        },
    };

    return (
        <CardInfoContext.Provider value={value}>
            {children}
        </CardInfoContext.Provider>
    );
}
