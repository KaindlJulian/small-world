import * as d3 from 'd3';
import { Link } from 'lucide-preact';
import { useEffect, useRef } from 'preact/hooks';

export function AboutPage() {
    const graphRef = useRef(null);

    useEffect(() => {
        if (!graphRef.current) return;

        const container = graphRef.current;
        const width = container.clientWidth;
        const height = 160;

        d3.select(container).selectAll('*').remove();

        const svg = d3
            .select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'overflow-visible');

        const nodes = [
            { id: 'hand', label: 'Hand', xPct: 0.2 },
            { id: 'bridge', label: 'Bridge', xPct: 0.5 },
            { id: 'target', label: 'Target', xPct: 0.8 },
        ];

        const links = [
            { source: 'hand', target: 'bridge' },
            { source: 'bridge', target: 'target' },
        ];

        const simulation = d3
            .forceSimulation(nodes)
            .force(
                'link',
                d3
                    .forceLink(links)
                    .id((d) => d.id)
                    .distance(width * 0.25),
            )
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX((d) => width * d.xPct).strength(0.5))
            .force('y', d3.forceY(height / 2).strength(0.2));

        const link = svg
            .append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'stroke-gray-300 dark:stroke-zinc-600 stroke-2');

        const node = svg
            .append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('cursor', 'grab')
            .call(
                d3
                    .drag()
                    .on('start', (e, d) => {
                        if (!e.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (e, d) => {
                        d.fx = e.x;
                        d.fy = e.y;
                    })
                    .on('end', (e, d) => {
                        if (!e.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    }),
            );

        node.append('rect')
            .attr('width', 70)
            .attr('height', 50)
            .attr('x', -35)
            .attr('y', -25)
            .attr('rx', 6)
            .attr('class', (d) =>
                d.id === 'bridge'
                    ? 'fill-teal-50 stroke-teal-500 stroke-2 dark:fill-teal-900 dark:stroke-teal-400'
                    : 'fill-white stroke-gray-300 stroke-2 dark:fill-zinc-800 dark:stroke-zinc-600',
            );

        node.append('text')
            .text((d) => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('class', (d) =>
                d.id === 'bridge'
                    ? 'text-xs font-bold fill-teal-700 dark:fill-teal-300 font-sans pointer-events-none'
                    : 'text-xs font-bold fill-gray-700 dark:fill-gray-200 font-sans pointer-events-none',
            );

        simulation.on('tick', () => {
            link.attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
            node.attr('transform', (d) => `translate(${d.x},${d.y})`);
        });

        return () => simulation.stop();
    }, []);

    return (
        <div class='min-h-screen bg-zinc-50 px-4 py-12 font-sans sm:px-6 lg:px-8 dark:bg-zinc-900'>
            <div class='mx-auto max-w-4xl space-y-12'>
                <div class='space-y-4 text-center'>
                    <h1 class='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
                        About this Small World Searcher
                    </h1>
                </div>

                <div class='overflow-hidden bg-white shadow-lg sm:rounded-xl dark:bg-zinc-800'>
                    <div class='border-b border-zinc-100 px-6 py-4 dark:border-zinc-700'>
                        <h2
                            class='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'
                            id='the-mechanic'
                        >
                            <span class='text-teal-500'>◆</span> The Mechanic:
                            How "Small World" Works
                        </h2>
                    </div>

                    <div class='grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0 dark:divide-zinc-700'>
                        <div class='flex flex-col justify-between space-y-6 bg-zinc-50/50 p-6 dark:bg-zinc-900/30'>
                            <div class='relative rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800'>
                                <div class='absolute -top-3 left-4 bg-teal-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-teal-700 uppercase dark:bg-teal-900 dark:text-teal-300'>
                                    Small World
                                </div>
                                <p class='align-middle text-sm leading-relaxed text-gray-600 dark:text-gray-400'>
                                    Reveal 1 monster in your hand, choose 1
                                    monster from your Deck that has exactly 1 of
                                    the same Type, Attribute, Level, ATK or DEF,
                                    and banish the revealed monster from your
                                    hand face-down. Then add, from the Deck to
                                    your hand, 1 monster that has exactly 1 of
                                    the same Type, Attribute, Level, ATK or DEF
                                    as the monster chosen from your Deck, and
                                    banish the card chosen from the Deck
                                    face-down. You can only activate 1 "Small
                                    World" per turn.
                                </p>
                            </div>

                            <div
                                ref={graphRef}
                                class='relative w-full overflow-hidden rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700'
                            ></div>
                        </div>

                        <div class='flex flex-col justify-center space-y-6 p-6'>
                            <div>
                                <h3 class='mb-2 flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                                    In other words
                                </h3>
                                <p class='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                                    Small World is a card that allows a player
                                    to swap a monster in their hand for any
                                    specific monster in their deck. It
                                    essentially lets you trade a card you{' '}
                                    <em>have</em> for a card you <em>need</em>.
                                </p>
                            </div>

                            <div>
                                <h3 class='mb-2 flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                                    The Constraint
                                </h3>
                                <p class='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                                    This trade cannot happen directly. It
                                    requires a chain of three cards. For the
                                    chain to be valid, each step must share{' '}
                                    <strong>exactly one</strong> property
                                    (Level, Type, Attribute, ATK, or DEF). If
                                    they share zero, or more than one, the
                                    connection is not valid.
                                </p>
                            </div>

                            <div class='space-y-3 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-700/40'>
                                <h4 class='font-bold text-gray-900 dark:text-white'>
                                    Connection Examples
                                </h4>

                                <div class='flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600'>
                                    <span class='text-gray-600 dark:text-gray-300'>
                                        Share Level only?
                                    </span>
                                    <span class='flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400'>
                                        <svg
                                            class='h-4 w-4'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                                stroke-width='2'
                                                d='M5 13l4 4L19 7'
                                            />
                                        </svg>
                                        Valid Match
                                    </span>
                                </div>

                                <div class='flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600'>
                                    <span class='text-gray-600 dark:text-gray-300'>
                                        Share Level AND Type?
                                    </span>
                                    <span class='flex items-center gap-1 font-bold text-red-500 dark:text-red-400'>
                                        <svg
                                            class='h-4 w-4'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                                stroke-width='2'
                                                d='M6 18L18 6M6 6l12 12'
                                            />
                                        </svg>
                                        Invalid (Too Similar)
                                    </span>
                                </div>

                                <div class='flex items-center justify-between'>
                                    <span class='text-gray-600 dark:text-gray-300'>
                                        Share Nothing?
                                    </span>
                                    <span class='flex items-center gap-1 font-bold text-red-500 dark:text-red-400'>
                                        <svg
                                            class='h-4 w-4'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                                stroke-width='2'
                                                d='M6 18L18 6M6 6l12 12'
                                            />
                                        </svg>
                                        Invalid
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class='overflow-hidden bg-white shadow-lg sm:rounded-xl dark:bg-zinc-800'>
                    <div class='border-b border-zinc-100 px-6 py-4 dark:border-zinc-700'>
                        <h2
                            class='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'
                            id='how-to-use'
                        >
                            <span class='text-blue-500'>◆</span> How to use
                        </h2>
                    </div>
                    <div class='grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-zinc-700'>
                        <div class='space-y-3 p-6'>
                            <h3 class='flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                                <span class='flex size-5 items-center justify-center rounded-full bg-purple-100 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300'>
                                    1
                                </span>
                                Deck View
                            </h3>
                            <p class='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                                Upload or build your decklist to see a{' '}
                                <strong>connectivity graph</strong>. This helps
                                you visualize how good Small World will be with
                                your deck. Cards are nodes, and edges indicate
                                the bridge possibilities between them.
                            </p>
                        </div>
                        <div class='space-y-3 p-6'>
                            <h3 class='flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                                <span class='flex size-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300'>
                                    2
                                </span>
                                Bridge Explorer
                            </h3>
                            <p class='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                                Select the <strong>Starter</strong> (the card in
                                your hand) and the <strong>Target</strong> (the
                                card you want to search). The tool will
                                instantly list every monster in the game that
                                can act as a bridge between them and visualize
                                the connections in a graph. Nodes are cards,
                                edges are the stat that connects them. Also
                                supports multiple starters/targets.
                            </p>
                        </div>
                    </div>
                    <div class='border-t border-zinc-100 p-6 dark:border-zinc-700'>
                        <a
                            href='http://localhost:5173/deck?ydke=E1bEA6OpVwUx3BEBeA09A0e8fQA%3D'
                            class='group flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
                        >
                            <div class='flex items-center gap-4'>
                                <div class='flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                                    <Link />
                                </div>
                                <div>
                                    <h4 class='font-bold text-gray-900 dark:text-white'>
                                        Open Example Deck
                                    </h4>
                                    <p class='text-sm text-gray-600 dark:text-gray-400'>
                                        Check out this example deck to see the
                                        connectivity graph in action.
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div class='overflow-hidden bg-white shadow-lg sm:rounded-xl dark:bg-zinc-800'>
                    <div class='border-b border-zinc-100 px-6 py-4 dark:border-zinc-700'>
                        <h2
                            class='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'
                            id='backstory'
                        >
                            <span class='text-teal-500'>◆</span> Backstory: The
                            "Triple Tactics" Challenge
                        </h2>
                    </div>

                    <div class='space-y-4 p-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                        <p>
                            This project originated from the{' '}
                            <strong>"Triple Tactics Talent"</strong> challenge
                            in Master Duel. The goal was to collect points by
                            matching randomly selected monsters as closely as
                            possible across five criteria:
                            <strong>
                                {' '}
                                Frame, Attribute, Level, Type, ATK, and DEF
                            </strong>
                            .
                        </p>

                        <p>
                            To solve this, I performed a statistical analysis on
                            all ~12,000 Yu-Gi-Oh! monster cards. Initially, I
                            tried to identify the "most average" monster by
                            computing the dataset's <strong>Medoid</strong> (the
                            monster minimizing total distance to all others).
                            However, since the challenge requires <em>exact</em>{' '}
                            matches, a better approach was to find the
                            <strong> Mode</strong>-cards possessing the most
                            common values for each category.
                        </p>

                        <div class='my-4 rounded-lg border border-teal-100 bg-teal-50 p-4 dark:border-teal-800/50 dark:bg-teal-900/20'>
                            <h3 class='mb-2 text-sm font-semibold tracking-wide text-teal-900 uppercase dark:text-teal-300'>
                                The Result
                            </h3>
                            <p class='text-sm'>
                                The analysis revealed that cards like{' '}
                                <strong>Zero Gardna</strong>,{' '}
                                <strong>Gimmick Puppet Little Soldiers</strong>,
                                and <strong>Goblin Decoy Squad</strong> had the
                                highest theoretical connectivity scores based on
                                common properties.
                            </p>
                        </div>

                        <div class='mt-4'>
                            <a
                                href='https://github.com/KaindlJulian/md_ttt/blob/master/ttt.ipynb'
                                target='_blank'
                                rel='noopener noreferrer'
                                class='inline-flex items-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300'
                            >
                                Explore the Analysis Notebook & UMAP Plots{' '}
                                <span class='ml-1'>→</span>
                            </a>
                        </div>

                        <p>
                            After compiling the data for this challenge, I
                            wanted to do something more with it, leading to the
                            development of this
                            <strong> Small World Searcher Tool</strong> to find
                            bridge cards.
                        </p>
                    </div>
                </div>

                <div class='overflow-hidden bg-white shadow-lg sm:rounded-xl dark:bg-zinc-800'>
                    <div class='border-b border-zinc-100 px-6 py-4 dark:border-zinc-700'>
                        <h2
                            class='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'
                            id='search-implementation'
                        >
                            <span class='text-orange-400'>◆</span> Rust &
                            BitSets (Just Because)
                        </h2>
                    </div>

                    <div class='space-y-6 p-6 text-gray-600 dark:text-gray-300'>
                        <p>
                            As an excuse to write some Rust, I implemented the
                            core search engine based on BitSet indices. Then
                            compiled it to Wasm for use in this web app. A JS
                            loop would have sufficed for ~7000 main deck
                            monsters, but I wanted to experiment.
                        </p>
                        <p>
                            Instead of comparing card objects iteratively, this
                            approach uses pre-built indices where every specific
                            property value (e.g.
                            <em> "Level 4"</em>, <em>"DARK"</em>) corresponds to
                            a bitset over all cards. A bit is set if the card
                            has that property.
                        </p>

                        <div class='overflow-x-auto rounded-lg border border-zinc-700 bg-gray-900 p-5 font-mono text-sm text-gray-300 shadow-inner'>
                            <h3 class='mb-3 border-b border-zinc-500 pb-2 font-sans font-bold text-gray-300'>
                                Example for a Level 4 DARK Fiend Monster
                            </h3>

                            <div class='space-y-5'>
                                <div>
                                    <span class='text-gray-500'>
                                        // 1. Find Candidates (Match ≥ 1
                                        property)
                                    </span>
                                    <br />
                                    <span class='mb-1 block text-gray-500'>
                                        // Union of all property sets
                                    </span>
                                    <span class='text-blue-300'>let</span>{' '}
                                    candidates =
                                    <br />
                                    <span class='pl-4'>
                                        Index.ATTR[
                                        <span class='text-orange-300'>
                                            DARK
                                        </span>
                                        ] | Index.LVL[
                                        <span class='text-orange-300'>4</span>]
                                        | Index.TYPE[
                                        <span class='text-orange-300'>
                                            Fiend
                                        </span>
                                        ] ... ;
                                    </span>
                                </div>

                                <div>
                                    <span class='text-gray-500'>
                                        // 2. Find Exclusions (Match ≥ 2
                                        properties)
                                    </span>
                                    <br />
                                    <span class='mb-1 block text-gray-500'>
                                        // Intersection of every pair of
                                        properties
                                    </span>
                                    <span class='text-blue-300'>let</span>{' '}
                                    exclude =
                                    <br />
                                    <span class='pl-4'>
                                        (Index.ATTR[
                                        <span class='text-orange-300'>
                                            DARK
                                        </span>
                                        ] & Index.LVL[
                                        <span class='text-orange-300'>4</span>
                                        ]) |
                                    </span>
                                    <br />
                                    <span class='pl-4'>
                                        (Index.ATTR[
                                        <span class='text-orange-300'>
                                            DARK
                                        </span>
                                        ] & Index.TYPE[
                                        <span class='text-orange-300'>
                                            Fiend
                                        </span>
                                        ]) | ... ;
                                    </span>
                                </div>

                                <div>
                                    <span class='text-gray-500'>
                                        // 3. Calculate Neighborhood (Match
                                        exactly 1)
                                    </span>
                                    <br />
                                    <span class='mb-1 block text-gray-500'>
                                        // Take candidates and remove anything
                                        that matched more than once
                                    </span>
                                    <span class='text-blue-300'>let</span>{' '}
                                    neighborhood = candidates & (!exclude);
                                </div>

                                <div>
                                    <span class='text-gray-500'>
                                        // 4. Find Bridges
                                    </span>
                                    <br />
                                    <span class='mb-1 block text-gray-500'>
                                        // Then the possible bridges are just
                                        the intersection of neighborhoods
                                    </span>
                                    neighborhood(a) & neighborhood(b);
                                </div>
                            </div>
                        </div>

                        <p class='text-sm'>
                            This set-based approach reduces the entire search
                            process to efficient bitwise operations and lookups.
                        </p>
                    </div>
                </div>

                <div>
                    <div class='flex flex-col justify-between bg-white p-6 shadow-lg sm:rounded-lg dark:bg-zinc-800'>
                        <div>
                            <h3
                                class='mb-4 text-lg font-medium text-gray-900 dark:text-white'
                                id='credits'
                            >
                                Credits
                            </h3>
                            <ul class='space-y-3 text-sm text-gray-600 dark:text-gray-400'>
                                <li class='flex items-start gap-2'>
                                    <span class='text-teal-500'>•</span>
                                    <span>
                                        Attribute Icons & Level Stars by{' '}
                                        <a
                                            href='https://yugipedia.com/wiki/User:Falzar_FZ'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            class='font-medium text-gray-900 hover:underline dark:text-white'
                                        >
                                            Falzar FZ
                                        </a>{' '}
                                        on Yugipedia{' '}
                                        <span class='opacity-75'>
                                            (CC BY-SA 3.0)
                                        </span>
                                        .
                                    </span>
                                </li>
                                <li class='flex items-start gap-2'>
                                    <span class='text-teal-500'>•</span>
                                    <span>
                                        Card Data & Images provided by the{' '}
                                        <a
                                            href='https://ygoprodeck.com/'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            class='font-medium text-gray-900 hover:underline dark:text-white'
                                        >
                                            YGOPRODeck
                                        </a>{' '}
                                        API.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
