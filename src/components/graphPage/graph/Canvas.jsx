import React, {useContext, useEffect, useState} from 'react'
import * as d3 from 'd3'
import {GraphContext} from "../graphPage";

const canvas = (props) => {
    const {scales, margins, data, svgDimensions, forwardRef} = props;
    const {xScale, yScale} = scales;
    const {width, height} = svgDimensions;

    const [isCircle, setIsCircle] = useState(false);

    const context = useContext(GraphContext);

    useEffect(() => {
        const svg = d3.select(forwardRef.current);

        const r = 50;

        const rect = svg.append("rect")
            .attr('fill', '#252728')
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("rx", r)
            .attr("ry", r)
            .attr("width", r * 2)
            .attr("height", r * 2)
            .on('click', () => runTween(setIsCircle(!isCircle)));

        const text = svg.append('text')
            .text('show')
            .attr('font-size', 36)
            .attr("x", width / 2 + 8)
            .attr("y", height / 2 + 60)
            .attr('fill', 'white')
            .attr('id', 'start-text')
            .attr('opacity', 1);


        function runTween(toRect) {

            context.click()

            if (!toRect) {
                // circle to rect
                rect.transition('corners')
                    .duration(750)
                    .attr("rx", 0)
                    .attr("ry", 0);
                rect.transition('width')
                    .delay(300)
                    .duration(1400)
                    .attr("width", width + margins.right)
                    .attr("height", height);
                rect.transition('position')
                    .delay(300)
                    .duration(1400)
                    .attr("x", 0)
                    .attr("y", 0)
                text.transition('text')
                    .duration(1000)
                    .attr('opacity', 0)
                    .on('end', () => d3.select('#start-text').remove())
            } else {
                // rect to circle
                rect.transition('width')
                    .duration(2500)
                    .attr("width", r * 2);
                rect.transition('corners')
                    .delay(1250)
                    .duration(1500)
                    .attr("rx", r)
                    .attr("ry", r);
            }
        }
    }, [null]);

    return null;

};

export default canvas;