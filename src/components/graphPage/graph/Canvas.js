import {useContext, useEffect} from 'react';
import * as d3 from 'd3';
import {GraphContext} from "../graphPage";
import * as PropTypes from 'prop-types';

canvas.propTypes = {
    margins: PropTypes.object,
    dimensions: PropTypes.object,
    forwardRef: PropTypes.object
};

export default function canvas ({margins, dimensions, forwardRef})  {
    const {width, height} = dimensions;

    const context = useContext(GraphContext);

    useEffect(() => {
        const svg = d3.select(forwardRef.current);

        const r = 50;

        const rect = svg.append("rect")
            .attr('id', 'canvas')
            .attr('fill', '#252728')
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("rx", r)
            .attr("ry", r)
            .attr("width", r * 2)
            .attr("height", r * 2)
            .attr('opacity', 1)
            .on('click', () => startAnimation());

        const text = svg.append('text')
            .text('show')
            .attr('font-size', 36)
            .attr("x", width / 2 + 8)
            .attr("y", height / 2 + 60)
            .attr('fill', 'white')
            .attr('id', 'start-text')
            .attr('opacity', 1)
            .on('click', () => startAnimation());


        const startAnimation = () => {

            context.startRenderGraphComponents();

            rect.transition('corners')
                .duration(750)
                .attr("rx", 0)
                .attr("ry", 0)
                .attr('opacity', 0);
            rect.transition('width')
                .delay(300)
                .duration(1400)
                .attr("width", width + margins.right)
                .attr("height", height)
                .on('end', () => d3.select('#canvas').remove());

            rect.transition('position')
                .delay(300)
                .duration(1400)
                .attr("x", 0)
                .attr("y", 0);
            text.transition('text')
                .duration(1000)
                .attr('opacity', 0)
                .on('end', () => d3.select('#start-text').remove());
        };
    }, [null]);

    return null;

}