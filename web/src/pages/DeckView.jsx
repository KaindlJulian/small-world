import { LogOut } from 'lucide-preact';
import { useLocation, useRoute } from 'preact-iso';
import { useEffect } from 'react';
import {
    Button,
    CardInfo,
    DeckForceGraph,
    DeckInput,
    DeckList,
    LoadingSpinner,
    Sidebar,
} from '../components';
import { deckCodesSignal } from '../core/signals.js';
import { useGraphData, useSearcher } from '../hooks';
import { cn } from '../utils';
import { decode_ydke, encode_ydke_main } from '../wasm';

export function DeckView() {
    const { searcher, isSearcherLoading } = useSearcher();
    const { route } = useLocation();
    const { query } = useRoute();
    const ydkeUrlParam = query.ydke;
    const codes = deckCodesSignal.value || [];

    useEffect(() => {
        if (ydkeUrlParam && deckCodesSignal.value === null) {
            const ids = decode_ydke(`ydke://${ydkeUrlParam}!!!`);
            deckCodesSignal.value = Array.from(ids);
        }
    }, []);

    useEffect(() => {
        if (deckCodesSignal.value && deckCodesSignal.value.length > 0) {
            const ydkeString = encode_ydke_main(deckCodesSignal.value)
                .replace('ydke://', '')
                .replace('!!!', '');
            const encodedYdkeString = encodeURIComponent(ydkeString);
            if (encodedYdkeString !== ydkeUrlParam) {
                route(`/deck?ydke=${encodedYdkeString}`, true);
            }
        }
    }, [deckCodesSignal.value]);

    if (isSearcherLoading) {
        return (
            <div class='flex h-full items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    }

    const displayData = codes
        .map((id) => {
            const c = searcher.get_by_id(id);

            // filter out Spell/Trap cards and unrecognized IDs
            if (!c) return null;

            return {
                id: c.id,
                name: c.name_js,
                attribute: c.attribute_js,
                level: c.level,
                properties: [c.type_js],
                atk: c.atk,
                def: c.def,
            };
        })
        .filter((c) => c !== null);

    const { nodes, links } = useGraphData(displayData, searcher);

    return (
        <div
            class={cn(
                'h-full divide-zinc-700 transition-all',
                displayData.length === 0
                    ? 'flex justify-center'
                    : 'grid lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]',
            )}
        >
            <CardInfo />

            <div class='relative flex flex-col items-center justify-center overflow-hidden'>
                {displayData.length === 0 ? (
                    <DeckInput
                        onInput={(list) => (deckCodesSignal.value = list)}
                    />
                ) : (
                    <>
                        <div class='relative h-full w-full'>
                            <DeckForceGraph nodes={nodes} links={links} />
                        </div>

                        <Button
                            className='fixed bottom-4 left-4 max-lg:hidden'
                            variant='ghost'
                            onClick={() => {
                                deckCodesSignal.value = null;
                                route('/deck', true);
                            }}
                        >
                            <LogOut className='mr-1' />
                            <span>Exit</span>
                        </Button>
                    </>
                )}
            </div>

            {displayData.length > 0 && (
                <Sidebar class='col-span-2 lg:col-span-1'>
                    <div class='h-full transition-opacity'>
                        <DeckList
                            cards={displayData}
                            onRemoveCard={(card) => {
                                deckCodesSignal.value = codes.filter(
                                    (id) => id !== card.id,
                                );
                            }}
                            onAddCard={(card) => {
                                deckCodesSignal.value = [...codes, card.id];
                            }}
                        />
                    </div>
                </Sidebar>
            )}
        </div>
    );
}
