import React, {useContext, useRef} from 'react'
import {scaleBand, scaleLinear} from 'd3'
import Aux from '../../../hoc/Aux/Aux'
import Axes from "./Axes";
import Bars from "./Bars";
import Line from "./Line";
import Canvas from "./Canvas";
import {GraphContext} from "../graphPage";

const chart = (props) => {

    const level1 = useRef(null);
    const level2 = useRef(null);
    const level3 = useRef(null);

    const context = useContext(GraphContext);


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

    let content = null;

    if (context.isShown) {
        content = (
            <Aux>
                <Axes
                    forwardRef={level2}
                    scales={scales}
                    margins={margins}
                    svgDimensions={svgDimensions}
                />

                <Line
                    forwardRef={level1}
                    scales={scales}
                    margins={margins}
                    data={data}
                    maxVal={maxVal}
                    svgDimensions={svgDimensions}
                />

                <Bars
                    json={props.json}
                    forwardRef={level2}
                    scales={scales}
                    margins={margins}
                    data={data}
                    maxVal={maxVal}
                    svgDimensions={svgDimensions}
                />
            </Aux>
        )
    }

    return (
        <svg width={window.innerWidth} height={svgDimensions.height}>
            <g ref={level1}>
                <g ref={level2}>
                    <g ref={level3}>
                        <Canvas
                            forwardRef={level3}
                            scales={scales}
                            margins={margins}
                            data={data}
                            maxVal={maxVal}
                            svgDimensions={svgDimensions}
                        />
                    </g>
                    {content}
                </g>
            </g>


        </svg>
    )
};

export default chart;