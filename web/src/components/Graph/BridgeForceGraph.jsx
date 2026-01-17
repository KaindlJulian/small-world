import { useCardInfo } from '@/hooks/useCardInfo.js';
import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';

const INITIAL_SCALE = 1;
const PRIMARY_COLOR = '#14b8a6'; // teal-400
const BASE_COLOR = '#94a3b8'; // slate-400

export function BridgeForceGraph({ sources, bridges, targets }) {
    const svgRef = useRef(null);
    const simulationRefBridges = useRef(null);
    const simulationSourcesRef = useRef(null);
    const simulationTargetsRef = useRef(null);
    const zoomRef = useRef(null);
    const selectedNodeRef = useRef(null);
    const { cardSignal, setCardInfo } = useCardInfo();

    if (sources.length === 0 || bridges.length === 0 || targets.length === 0) {
        return;
    }

    const links = useMemo(() => {
        return sources.flatMap((s) => {
            return bridges.flatMap((b) => {
                return [
                    { source: s, target: b },
                    ...targets.map((t) => {
                        return {
                            source: b,
                            target: t,
                        };
                    }),
                ];
            });
        });
    }, [sources, bridges, targets]);

    useEffect(() => {
        if (!svgRef.current) return;
        console.log('render graph');

        const { width, height } = svgRef.current.getBoundingClientRect();
        const w = width || 600;
        const h = height || 400;

        // view and container setup
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('viewBox', [-w / 2, -h / 2, w, h]);
        const global = svg.append('g').attr('class', 'global');

        // Clip paths for images
        setupDefs(svg);

        // Simulations
        const simulationSources = setupAlignVerticalSimulation(sources, -w / 2);
        simulationSourcesRef.current = simulationSources;
        const simulationBridges = setupAlignVerticalSimulation(bridges, 0);
        simulationRefBridges.current = simulationBridges;
        const simulationTargets = setupAlignVerticalSimulation(targets, w / 2);
        simulationTargetsRef.current = simulationTargets;

        // Elements
        const link = createLinks(global, links);
        const sourceNodes = createNodes(
            global,
            sources,
            link,
            setCardInfo,
            simulationSources,
            selectedNodeRef,
        );
        const bridgeNodes = createNodes(
            global,
            bridges,
            link,
            setCardInfo,
            simulationBridges,
            selectedNodeRef,
        );
        const targetNodes = createNodes(
            global,
            targets,
            link,
            setCardInfo,
            simulationTargets,
            selectedNodeRef,
        );

        simulationSources.on('tick', () => updatePositions(link, sourceNodes));
        simulationBridges.on('tick', () => updatePositions(link, bridgeNodes));
        simulationTargets.on('tick', () => updatePositions(link, targetNodes));

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
    }, [sources, bridges, targets]);

    return (
        <div class='relative flex h-full w-full touch-none flex-col items-center justify-center overflow-hidden select-none'>
            <svg
                ref={svgRef}
                class='block h-full w-full'
                preserveAspectRatio='xMidYMid meet'
            ></svg>
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
        .attr('r', 6)
        .attr('cx', 0)
        .attr('cy', 0);
    return defs;
}

function setupAlignVerticalSimulation(nodes, width) {
    return d3
        .forceSimulation(nodes)
        .force(
            'y',
            d3.forceY().y((d) => d.y),
        )
        .force('x', d3.forceX(width).strength(0.3));
}

function updatePositions(link, nodes) {
    link.attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.initialY)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.initialY);
    nodes.attr('transform', (d) => `translate(${d.x},${d.initialY})`);
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
        .attr('stroke-opacity', 0.7)
        .attr('stroke-width', 2);
    return link;
}

function createNodes(
    global,
    nodes,
    link,
    setCardInfo,
    simulation,
    selectedNodeRef,
) {
    const verticalSpacing = 25;

    nodes.forEach((d, i) => {
        d.y = (i - (nodes.length - 1) / 2) * verticalSpacing;
        d.initialY = d.y;
    });

    const node = global
        .append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .style('cursor', 'pointer')
        .call(
            d3
                .drag()
                .on('start', (event, d) => {
                    simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    d.fx = null;
                    d.fy = null;
                }),
        );

    node.on('click', (event, d) => {
        event.stopPropagation();
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
    });

    node.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 10)
        .attr('fill', 'white');

    node.append('image')
        .attr('href', 'bg.jpg')
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
    link.attr('stroke', BASE_COLOR);
}
