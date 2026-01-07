import { useContext } from 'react';
import { CardInfoContext } from '../context/CardInfoContext.jsx';

export function useCardInfo() {
    const context = useContext(CardInfoContext);

    if (context === undefined) {
        throw new Error('useCardInfo must be used within a CardInfoProvider');
    }

    return context;
}
