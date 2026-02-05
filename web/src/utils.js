import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function cloneWasmCard(card) {
    return {
        id: card.id,
        name: card.name_js,
        attribute: card.attribute_js,
        level: card.level,
        properties: [card.type_js],
        atk: card.atk,
        def: card.def,
    };
}

export const publicAssetUrl = import.meta.env.VITE_PUBLIC_ASSET_URL;
