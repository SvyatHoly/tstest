import React from 'react'
import * as d3 from 'd3'

const line = (props) => {
    const {scales, margins, data, svgDimensions} = props;
    const {xScale, yScale} = scales;
    const {height, width} = svgDimensions;

    const line = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.plan))
        .curve(d3.curveMonotoneX);

    const dataset = data.map(d => ({"y": d.actual}));

    return (
        <g
            fill={'none'}
            stroke={'#ffab00'}
            stroke-width='3'>
            <path
                d={line(data)}/>
        </g>
    )
};

export default line;