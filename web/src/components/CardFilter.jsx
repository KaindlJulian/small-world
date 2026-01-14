import { useState } from 'react';
import { Input, MultiCombobox } from '.';

const ATTRIBUTES = [
    'DARK',
    'LIGHT',
    'EARTH',
    'WATER',
    'FIRE',
    'WIND',
    'DIVINE',
];

const TYPES = [
    'Aqua',
    'Beast',
    'Beast-Warrior',
    'Cyberse',
    'Dinosaur',
    'Divine-Beast',
    'Dragon',
    'Fairy',
    'Fiend',
    'Fish',
    'Insect',
    'Illusion',
    'Machine',
    'Plant',
    'Psychic',
    'Pyro',
    'Reptile',
    'Rock',
    'Sea Serpent',
    'Spellcaster',
    'Thunder',
    'Warrior',
    'Winged Beast',
    'Wyrm',
    'Zombie',
];

export function CardFilter({ onFilterChange }) {
    const [filters, setFilters] = useState({
        attributes: [],
        levels: [],
        types: [],
        minATK: null,
        maxATK: null,
        minDEF: null,
        maxDEF: null,
    });

    return (
        <>
            <div class='flex flex-col gap-2 xl:flex-row'>
                <MultiCombobox
                    items={ATTRIBUTES.map((attr) => ({
                        id: attr,
                        text: attr,
                    }))}
                    dropDownAbove={true}
                    placeholder='Select attributes'
                    onSelect={(attributes) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                attributes: attributes.map((a) => a.id),
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
                <MultiCombobox
                    items={[...Array(12).keys()].map((i) => ({
                        id: i + 1,
                        text: String(i + 1),
                    }))}
                    dropDownAbove={true}
                    placeholder='Select levels'
                    onSelect={(levels) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                levels: levels.map((l) => l.id),
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
                <MultiCombobox
                    items={TYPES.map((type) => ({
                        id: type,
                        text: type,
                    }))}
                    dropDownAbove={true}
                    placeholder='Select types'
                    onSelect={(types) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                types: types.map((t) => t.id),
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
            </div>
            <div class='flex gap-2'>
                <Input
                    type='number'
                    placeholder='Min ATK'
                    onInput={(text) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                minATK: parseInt(text, 10) || null,
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
                <Input
                    type='number'
                    placeholder='Max ATK'
                    onInput={(text) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                maxATK: parseInt(text, 10) || null,
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
                <Input
                    type='number'
                    placeholder='Min DEF'
                    onInput={(text) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                minDEF: parseInt(text, 10) || null,
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
                <Input
                    type='number'
                    placeholder='Max DEF'
                    onInput={(text) => {
                        setFilters((prev) => {
                            const updated = {
                                ...prev,
                                maxDEF: parseInt(text, 10) || null,
                            };
                            onFilterChange(updated);
                            return updated;
                        });
                    }}
                />
            </div>
        </>
    );
}
