import * as d3 from 'd3';
import { Maximize } from 'lucide-preact';
import { useEffect, useRef } from 'react';
import { GraphControls } from '../components';

const INITIAL_SCALE = 1.5;
const PRIMARY_COLOR = 'oklch(0.9 0.14 149.81)';
const BASE_COLOR = '#99a1af';

export function ForceGraph({ nodes, links, setCardInfo }) {
    console.log('render graph');

    const svgRef = useRef(null);
    const zoomRef = useRef(null);
    const simulationRef = useRef(null);
    const isLockedRef = useRef(false);

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

    const handleToggleLayout = (isLocked) => {
        if (simulationRef.current) {
            isLockedRef.current = !isLocked;
            if (!isLocked) {
                simulationRef.current.stop();
            } else {
                simulationRef.current.alpha(0.3).restart();
            }
        }
    };

    const handleShowBridges = () => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('.link-label')
            .transition()
            .duration(200)
            .style('opacity', 1);
        svg.selectAll('.bridge-circle')
            .transition()
            .duration(200)
            .attr('fill', BASE_COLOR);
    };

    useEffect(() => {
        if (!svgRef.current) return;

        const { width, height } = svgRef.current.getBoundingClientRect();
        const w = width || 600;
        const h = height || 400;

        const svg = d3.select(svgRef.current);

        svg.selectAll('*').remove();
        svg.attr('viewBox', [-w / 2, -h / 2, w, h]);

        const global = svg.append('g');

        // Clip paths for images
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

        // Force simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force('collide', d3.forceCollide(15))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(0, 0))
            .force('radial', d3.forceRadial(100, 0, 0).strength(0.5));
        simulationRef.current = simulation;

        // Links
        const link = global
            .append('g')
            .attr('stroke', BASE_COLOR)
            .attr('stroke-opacity', 0.7)
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
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

        // Nodes
        const node = global
            .append('g')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                event.stopPropagation();
                setCardInfo(d);
                // highlight selected node and connected links
                d3.select(event.currentTarget)
                    .select('circle')
                    .attr('stroke', PRIMARY_COLOR)
                    .attr('stroke-width', 0)
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
            })
            .call(
                d3
                    .drag()
                    .on('start', (event, d) => {
                        if (!event.active && !isLockedRef.current) {
                            simulation.alphaTarget(0.3).restart();
                        }
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                        if (isLockedRef.current) {
                            d.x = event.x;
                            d.y = event.y;
                            updatePositions();
                        }
                    })
                    .on('end', (event, d) => {
                        if (!event.active && !isLockedRef.current) {
                            simulation.alphaTarget(0);
                        }
                        d.fx = null;
                        d.fy = null;
                    }),
            );

        node.append('circle').attr('r', 10).attr('fill', 'white');

        node.append('image')
            .attr('href', 'bg.jpg')
            .attr('width', 20)
            .attr('height', 20)
            .attr('x', -10)
            .attr('y', -10)
            .attr('preserveAspectRatio', 'xMidYMid slice')
            .attr('clip-path', 'url(#circle-clip)');

        // Simulation Tick
        const updatePositions = () => {
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
        };
        simulation.on('tick', updatePositions);

        // Reset active elements on background click
        svg.on('click', () => {
            node.selectAll('circle')
                .attr('stroke', null)
                .attr('stroke-width', null);
            link.transition().duration(200).attr('stroke', BASE_COLOR);
            global
                .selectAll('.link-label')
                .transition()
                .duration(200)
                .style('opacity', 0);
        });

        // Zooming and Panning
        const zoom = d3
            .zoom()
            .scaleExtent([0.7, 10])
            .on('start', (event) => {
                if (
                    event.sourceEvent &&
                    event.sourceEvent.type === 'mousedown'
                ) {
                    svg.style('cursor', 'all-scroll');
                }
            })
            .on('end', () => {
                svg.style('cursor', 'default');
            })
            .on('zoom', (event) => {
                global.attr('transform', event.transform);
            });
        zoomRef.current = zoom;
        svg.call(zoom.transform, d3.zoomIdentity.scale(INITIAL_SCALE)).call(
            zoom,
        );
    }, [nodes, links]);

    return (
        <div class='relative flex h-full w-full touch-none flex-col items-center justify-center overflow-hidden select-none'>
            <button
                class='absolute top-4 right-4 cursor-pointer rounded-md bg-slate-700 px-1.5 py-1.5 hover:bg-slate-600 hover:shadow-lg'
                onClick={handleResetZoom}
            >
                <Maximize />
            </button>
            <svg
                ref={svgRef}
                class='block h-full w-full'
                preserveAspectRatio='xMidYMid meet'
            ></svg>
            <GraphControls
                showRemove={false} // show button to remove selected card
                onShowBridges={handleShowBridges} // show or hide all bridge icons
                onAddCard={() => {}} // add a new card to the graph, dont implement for now
                onRemoveCard={() => {}} // remove the selected card from the graph
                onToggleLayout={handleToggleLayout}
            />
        </div>
    );
}
