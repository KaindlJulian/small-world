import { useCardInfo } from '@/hooks';
import { useSignal } from '@preact/signals';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { GraphControls } from './GraphControls.jsx';

const INITIAL_SCALE = 1.5;
const PRIMARY_COLOR = '#14b8a6'; // teal-400
const BASE_COLOR = '#94a3b8'; // slate-400

export function ForceGraph({ nodes, links }) {
    const svgRef = useRef(null);
    const zoomRef = useRef(null);
    const simulationRef = useRef(null);
    const isLocked = useSignal(false);
    const isShowingLabels = useSignal(false);
    const { cardSignal, setCardInfo } = useCardInfo();

    const handleHighlightNode = (nodeId) => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        const node = svg.selectAll('.node').filter((d) => d.id === nodeId);
        node.dispatch('click');
    };

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

    const handleToggleLayout = (locked) => {
        if (simulationRef.current) {
            if (locked) {
                simulationRef.current.stop();
            } else {
                simulationRef.current.alpha(0.3).restart();
            }
        }
    };

    const handleShowBridges = (show) => {
        if (show) {
            if (!svgRef.current) return;
            const svg = d3.select(svgRef.current);
            svg.selectAll('.node-circle')
                .transition()
                .duration(200)
                .attr('stroke', null);
            svg.selectAll('.link').attr('stroke', BASE_COLOR);
            svg.selectAll('.link-label')
                .transition()
                .duration(200)
                .style('opacity', 1);
            svg.selectAll('.bridge-circle')
                .transition()
                .duration(200)
                .attr('fill', BASE_COLOR);
        } else {
            if (!svgRef.current) return;
            const svg = d3.select(svgRef.current);
            resetHighlighted(
                svg.selectAll('.node'),
                svg.selectAll('.link'),
                svg.selectAll('.global'),
            );
        }
    };

    useEffect(() => {
        const highlightedCard = cardSignal.value;
        if (highlightedCard) {
            handleHighlightNode(highlightedCard.id);
        }
    }, [cardSignal.value]);

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

        // Simulation
        const simulation = setupSimulation(nodes);
        simulationRef.current = simulation;

        // Elements
        const { link, linkLabel } = createLinks(global, links, setCardInfo);
        const node = createNodes(
            global,
            nodes,
            link,
            linkLabel,
            simulation,
            isLocked,
            setCardInfo,
        );

        // Simulation Tick
        simulation.on('tick', () => updatePositions(link, linkLabel, node));

        // Reset on background click
        svg.on('click', () => {
            isShowingLabels.value = false;
            resetHighlighted(node, link, global);
        });

        // Zooming and Panning
        const zoom = setupZoom(svg, global);
        zoomRef.current = zoom;
        svg.call(zoom.transform, d3.zoomIdentity.scale(INITIAL_SCALE)).call(
            zoom,
        );
    }, [nodes, links]);

    return (
        <div class='relative flex h-full w-full touch-none flex-col items-center justify-center overflow-hidden select-none'>
            <svg
                ref={svgRef}
                class='block h-full w-full'
                preserveAspectRatio='xMidYMid meet'
            ></svg>
            <GraphControls
                isLocked={isLocked}
                isShowingLabels={isShowingLabels}
                onShowBridges={handleShowBridges}
                onToggleLayout={handleToggleLayout}
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
        .attr('r', 6)
        .attr('cx', 0)
        .attr('cy', 0);
    return defs;
}

function setupSimulation(nodes) {
    return d3
        .forceSimulation(nodes)
        .force('collide', d3.forceCollide(15))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(0, 0))
        .force('radial', d3.forceRadial(180, 0, 0).strength(0.5));
}

function setupZoom(svg, global) {
    const zoom = d3
        .zoom()
        .scaleExtent([0.7, 10])
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

function updatePositions(link, linkLabel, node) {
    link.attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

    linkLabel.attr('transform', (d) => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        return `translate(${x}, ${y})`;
    });

    node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
}

function createLinks(global, links, setCardInfo) {
    const link = global
        .append('g')
        .attr('stroke', BASE_COLOR)
        .attr('stroke-opacity', 0.7)
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke-width', 1.3);

    const linkLabel = global
        .append('g')
        .attr('class', 'link-labels')
        .selectAll('text')
        .data(links)
        .enter()
        .append('g')
        .attr('class', 'link-label')
        .style('opacity', 0);

    const bridgeNodes = linkLabel
        .selectAll('g.bridge-icon')
        .data((d) => d.bridges)
        .enter()
        .append('g')
        .attr('class', 'bridge-icon')
        .style('cursor', 'pointer')
        .attr('transform', (d, i, nodes) => {
            const total = nodes.length;
            const spacing = 10;
            const x = (i - (total - 1) / 2) * spacing;
            return `translate(${x}, 0)`;
        })
        .on('click', (event, d) => {
            event.stopPropagation();
            setCardInfo(d);
        });

    bridgeNodes
        .append('circle')
        .attr('class', 'bridge-circle')
        .attr('r', 6.5)
        .attr('fill', PRIMARY_COLOR);

    bridgeNodes
        .append('image')
        .attr('href', (d) => d.image || 'bg.jpg')
        .attr('width', 12)
        .attr('height', 12)
        .attr('x', -6)
        .attr('y', -6)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('clip-path', 'url(#link-clip)');

    return { link, linkLabel, bridgeNodes };
}

function createNodes(
    global,
    nodes,
    link,
    linkLabel,
    simulation,
    isLockedSignal,
    setCardInfo,
) {
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
                    if (!event.active && !isLockedSignal.value) {
                        simulation.alphaTarget(0.3).restart();
                    }
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                    if (isLockedSignal.value) {
                        d.x = event.x;
                        d.y = event.y;
                        updatePositions(link, linkLabel, node);
                    }
                })
                .on('end', (event, d) => {
                    if (!event.active && !isLockedSignal.value) {
                        simulation.alphaTarget(0);
                    }
                    d.fx = null;
                    d.fy = null;
                }),
        );

    node.on('click', (event, d) => {
        event.stopPropagation();
        setCardInfo(d);
        // highlight selected node and connected links
        node.select('circle').attr('stroke', null).attr('stroke-width', null);
        d3.select(event.currentTarget)
            .select('circle')
            .attr('stroke', PRIMARY_COLOR)
            .transition()
            .duration(200)
            .attr('stroke-width', 4);
        link.attr('stroke', (l) => {
            return l.source === d || l.target === d
                ? PRIMARY_COLOR
                : BASE_COLOR;
        });
        global.selectAll('.bridge-circle').attr('fill', PRIMARY_COLOR);
        global
            .selectAll('.link-label')
            .transition()
            .duration(200)
            .style('opacity', (l) => {
                return l.source === d || l.target === d ? 1 : 0;
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

function resetHighlighted(node, link, global) {
    node.selectAll('circle').attr('stroke', null).attr('stroke-width', null);
    link.attr('stroke', BASE_COLOR);
    global
        .selectAll('.link-label')
        .transition()
        .duration(200)
        .style('opacity', 0);
}
