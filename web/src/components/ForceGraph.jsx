import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export function ForceGraph({ nodes, links, setCardInfo }) {
    console.log('render graph');

    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const { width, height } = svgRef.current.getBoundingClientRect();
        const w = width || 600;
        const h = height || 400;

        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(tooltipRef.current);

        svg.selectAll('*').remove();
        svg.attr('viewBox', [-w / 2, -h / 2, w, h]);

        // Force simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force('collide', d3.forceCollide(15))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(0, 0))
            .force('radial', d3.forceRadial(100, 0, 0).strength(0.5));

        // Links
        const link = svg
            .append('g')
            .attr('stroke', '#99a1af')
            .attr('stroke-opacity', 0.7)
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke-width', 1.3);

        // clip path for node images
        const defs = svg.append('defs');
        defs.append('clipPath')
            .attr('id', 'circle-clip')
            .append('circle')
            .attr('r', 10)
            .attr('cx', 0)
            .attr('cy', 0);

        // Nodes
        const node = svg
            .append('g')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                tooltip
                    .style('opacity', 1)
                    .text(d.name)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 20}px`);
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 20}px`);
            })
            .on('mousedown', () => {
                tooltip.style('opacity', 0);
            })
            .on('click', (event, d) => {
                event.stopPropagation();
                if (setCardInfo) {
                    setCardInfo(d);
                }
            })
            .on('mouseout', () => {
                tooltip.style('opacity', 0);
            })
            .call(
                d3
                    .drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended),
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

        simulation.on('tick', () => {
            link.attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
            node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }, [nodes, links]);

    return (
        <div class='relative h-full w-full max-w-250 touch-none overflow-hidden select-none'>
            <div
                ref={tooltipRef}
                class='pointer-events-none fixed top-0 left-0 z-50 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-md transition-opacity duration-200'
            ></div>
            <svg
                ref={svgRef}
                class='block h-full w-full'
                preserveAspectRatio='xMidYMid meet'
            ></svg>
        </div>
    );
}
