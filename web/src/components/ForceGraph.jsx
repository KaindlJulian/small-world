import * as d3 from 'd3';
import { useEffect, useRef } from 'preact/hooks';

export function ForceGraph({ nodes, links }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 600;
        const height = 400;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // clear previous content

        // Simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force(
                'link',
                d3
                    .forceLink(links)
                    .id((d) => d.id)
                    .distance(80),
            )
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Links
        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke-width', 2);

        // Nodes
        const node = svg
            .append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', 10)
            .attr('fill', 'steelblue')
            .call(
                d3
                    .drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended),
            );

        // Labels
        const label = svg
            .append('g')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .text((d) => d.name)
            .attr('font-size', 12)
            .attr('dx', 12)
            .attr('dy', '.35em')
            .attr('fill', '#dadada');

        simulation.on('tick', () => {
            link.attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);

            node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

            label.attr('x', (d) => d.x).attr('y', (d) => d.y);
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
        <svg ref={svgRef} width={600} height={400} class='select-none'></svg>
    );
}
