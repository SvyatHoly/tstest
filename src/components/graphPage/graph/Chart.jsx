import React, {useRef} from 'react'
import {scaleBand, scaleLinear} from 'd3'

import Axes from "./Axes";
import Bars from "./Bars";
import Line from "./Line";

const chart = (props) => {

    const svgRef = useRef(null);

    const {data, maxVal} = props;
    const margins = {top: 50, right: 20, bottom: 100, left: 60};
    const svgDimensions = {width: 800, height: 500};

    const yScale = scaleLinear()
        .domain([0, maxVal + maxVal / 5])
        .range([svgDimensions.height - margins.bottom, margins.top]);

    const xScale = scaleBand()
        .padding(0.5)
        .domain(data.map(d => d.date))
        .range([margins.left, svgDimensions.width - margins.right]);

    const scales = {xScale, yScale};

    return (
        <svg ref={svgRef} width={window.innerWidth} height={svgDimensions.height}>
            <Axes
                scales={scales}
                margins={margins}
                svgDimensions={svgDimensions}
            />
            <Bars
                json={props.json}
                forwardRef={svgRef}
                scales={scales}
                margins={margins}
                data={data}
                maxVal={maxVal}
                svgDimensions={svgDimensions}
            />
            <Line
                forwardRef={svgRef}
                scales={scales}
                margins={margins}
                data={data}
                maxVal={maxVal}
                svgDimensions={svgDimensions}
            />
        </svg>
    )
};

export default chart;