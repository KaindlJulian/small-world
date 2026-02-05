import levelIcon from '@/assets/level_star.svg';
import { useCardInfo, useSearcher } from '@/hooks';
import { publicAssetUrl } from '@/utils.js';
import { useSignal } from '@preact/signals';
import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { GraphControls } from './GraphControls.jsx';

const attributeIconsImport = import.meta.glob('../../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

const INITIAL_SCALE = 1;
const PRIMARY_COLOR = '#14b8a6'; // teal-400
const BASE_COLOR = '#a1a1aa'; // zinc-400
const VERTICAL_SPACING = 40;

export function BridgeGraph({ sources, bridges, targets }) {
    const isShowingLabels = useSignal(true);
    const svgRef = useRef(null);
    const zoomRef = useRef(null);
    const selectedNodeRef = useRef(null);
    const { setCardInfo } = useCardInfo();
    const { searcher } = useSearcher();

    if (
        sources.length === 0 ||
        bridges.length === 0 ||
        targets.length === 0 ||
        !searcher
    ) {
        return <></>;
    }

    if (bridges.length + sources.length + targets.length > 300) {
        return (
            <div class='flex h-full w-full items-center justify-center'>
                <p class='text-center text-zinc-400'>
                    Graph too large to display (more than 300 cards).
                    <br />
                    Refine your search or filter the results.
                </p>
            </div>
        );
    }

    const links = useMemo(() => {
        return sources.flatMap((s) => {
            return bridges.flatMap((b) => {
                return [
                    {
                        source: s,
                        target: b,
                        property: searcher.compute_connecting_property(
                            s.id,
                            b.id,
                        ),
                    },
                    ...targets.map((t) => {
                        return {
                            source: b,
                            target: t,
                            property: searcher.compute_connecting_property(
                                b.id,
                                t.id,
                            ),
                        };
                    }),
                ];
            });
        });
    }, [bridges, searcher]);

    useEffect(() => {
        if (!svgRef.current) return;
        console.log('d3: render graph');

        const { width, height } = svgRef.current.getBoundingClientRect();
        const w = width || 600;
        const h = height || 400;
        const columnSpacing = w / 3;

        const assignPositions = (nodes, xPos, ySpace = VERTICAL_SPACING) => {
            nodes.forEach((d, i) => {
                d.x = xPos;
                d.y = (i - (nodes.length - 1) / 2) * ySpace;
            });
        };

        assignPositions(sources, -columnSpacing, 400);
        assignPositions(bridges, 0);
        assignPositions(targets, columnSpacing, 400);

        // view and container setup
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('viewBox', [-w / 2, -h / 2, w, h]);
        const global = svg.append('g').attr('class', 'global');

        // Clip paths for images
        setupDefs(svg);

        // Elements
        const link = createLinks(global, links);
        createNodes(
            global,
            sources,
            link,
            setCardInfo,
            selectedNodeRef,
            isShowingLabels,
        );
        createNodes(
            global,
            bridges,
            link,
            setCardInfo,
            selectedNodeRef,
            isShowingLabels,
        );
        createNodes(
            global,
            targets,
            link,
            setCardInfo,
            selectedNodeRef,
            isShowingLabels,
        );

        // Reset on background click
        svg.on('click', () => {
            resetHighlighted(selectedNodeRef, link);
        });

        // Zooming and Panning
        const zoom = setupZoom(svg, global);
        zoomRef.current = zoom;
        svg.call(zoom.transform, d3.zoomIdentity.scale(INITIAL_SCALE)).call(
            zoom,
        );
    }, [sources, bridges, targets, links]);

    const handleResetZoom = () => {
        if (svgRef.current && zoomRef.current) {
            const svg = d3.select(svgRef.current);
            svg.transition()
                .duration(200)
                .call(
                    zoomRef.current.transform,
                    d3.zoomIdentity.scale(INITIAL_SCALE),
                );
        }
    };

    const handleShowLabels = (show) => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('.link-label').style('display', show ? 'block' : 'none');
    };

    return (
        <div class='relative flex h-full w-full touch-none flex-col items-center justify-center overflow-hidden select-none'>
            <svg
                ref={svgRef}
                class='block h-full w-full'
                preserveAspectRatio='xMidYMid meet'
            ></svg>
            <GraphControls
                isShowingLabels={isShowingLabels}
                onShowLabels={handleShowLabels}
                onResetZoom={handleResetZoom}
            />
        </div>
    );
}

function setupDefs(svg) {
    const defs = svg.append('defs');
    defs.append('clipPath')
        .attr('id', 'circle-clip')
        .append('circle')
        .attr('r', 10)
        .attr('cx', 0)
        .attr('cy', 0);
    defs.append('clipPath')
        .attr('id', 'link-clip')
        .append('circle')
        .attr('r', 5)
        .attr('cx', 0)
        .attr('cy', 0);
    return defs;
}

function setupZoom(svg, global) {
    const zoom = d3
        .zoom()
        .scaleExtent([0.1, 10])
        .on('start', (event) => {
            if (event.sourceEvent && event.sourceEvent.type === 'mousedown') {
                svg.style('cursor', 'all-scroll');
            }
        })
        .on('end', () => {
            svg.style('cursor', 'default');
        })
        .on('zoom', (event) => {
            global.attr('transform', event.transform);
        });
    return zoom;
}

function createLinks(container, links) {
    const link = container
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', BASE_COLOR)
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', 2)
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

    const linkLabel = container
        .append('g')
        .attr('class', 'link-labels')
        .selectAll('text')
        .data(links)
        .enter()
        .append('g')
        .attr('class', 'link-label')
        .attr(
            'transform',
            (d) =>
                `translate(${(d.source.x + d.target.x) / 2}, ${(d.source.y + d.target.y) / 2})`,
        );

    linkLabel
        .filter(
            (d) =>
                d.property.startsWith('ATK') ||
                d.property.startsWith('DEF') ||
                d.property.startsWith('Type'),
        )
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 6)
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .text((d) => {
            if (d.property.startsWith('ATK') || d.property.startsWith('DEF')) {
                return d.property.replace(':', '/');
            } else {
                return `[ ${d.property.split(': ')[1]} ]`;
            }
        });

    linkLabel
        .filter(
            (d) =>
                d.property.startsWith('Attribute') ||
                d.property.startsWith('Level'),
        )
        .append('circle')
        .attr('class', 'bridge-circle')
        .attr('r', 5)
        .attr('stroke', BASE_COLOR);

    linkLabel
        .filter(
            (d) =>
                d.property.startsWith('Attribute') ||
                d.property.startsWith('Level'),
        )
        .append('image')
        .attr('href', (d) => {
            if (d.property.startsWith('Attribute')) {
                const attr = d.property.split(': ')[1];
                return attributeIconsImport[
                    `../../assets/attributes/${attr}.svg`
                ];
            } else {
                return levelIcon;
            }
        })
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', -5)
        .attr('y', -5)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('clip-path', 'url(#link-clip)');

    linkLabel
        .filter((d) => d.property.startsWith('Level'))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 8)
        .attr('font-weight', 'bold')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.25)
        .attr('y', 0.75)
        .text((d) => {
            return d.property.split(': ')[1];
        });

    return link;
}

function createNodes(
    global,
    nodes,
    link,
    setCardInfo,
    selectedNodeRef,
    isShowingLabels,
) {
    const node = global
        .append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .style('cursor', 'pointer')
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node.on('click', (event, d) => {
        event.stopPropagation();
        console.log(d);
        setCardInfo(d);
        node.select('circle').attr('stroke', null).attr('stroke-width', null);
        d3.select(event.currentTarget)
            .select('circle')
            .attr('stroke', PRIMARY_COLOR)
            .transition()
            .duration(200)
            .attr('stroke-width', 4);
        selectedNodeRef.current = event.currentTarget;
        link.attr('stroke', (l) => {
            return l.source === d || l.target === d
                ? PRIMARY_COLOR
                : BASE_COLOR;
        });
        global.selectAll('.link-label').style('display', (l) => {
            return l.source === d || l.target === d ? 'block' : 'none';
        });
        isShowingLabels.value = true;
    });

    node.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 10)
        .attr('fill', 'white');

    node.append('image')
        .attr('href', (d) => `${publicAssetUrl}/cropped/${d.id}.webp`)
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', -10)
        .attr('y', -10)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('clip-path', 'url(#circle-clip)');

    return node;
}

function resetHighlighted(selectedNodeRef, link) {
    if (selectedNodeRef.current) {
        d3.select(selectedNodeRef.current)
            .select('circle')
            .attr('stroke', null)
            .attr('stroke-width', null);
        selectedNodeRef.current = null;
    }
    link.attr('stroke', BASE_COLOR).attr('stroke-opacity', 0.5);
}
