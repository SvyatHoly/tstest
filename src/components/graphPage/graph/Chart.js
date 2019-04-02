import React, {useContext, useRef} from 'react';
import {scaleBand, scaleLinear} from 'd3';
import * as PropTypes from 'prop-types';
import Aux from '../../../hoc/Aux/Aux';
import Axes from "./Axes";
import Bars from "./Bars";
import Line from "./Line";
import Canvas from "./Canvas";
import {GraphContext} from "../graphPage";

chart.propTypes = {
    data: PropTypes.array,
    maxVal: PropTypes.number
};

/**
 * Component render svg and holds all graph elements into
 * */
export default function chart({data, maxVal}) {

    // we can render elements on different z-axis levels
    const level1 = useRef(null);
    const level2 = useRef(null);
    const level3 = useRef(null);

    const context = useContext(GraphContext);

    const margins = {top: 50, right: 20, bottom: 100, left: 60};
    const dimensions = {width: 800, height: 500};

    const yScale = scaleLinear()
        .domain([0, maxVal + maxVal / 5])
        .range([dimensions.height - margins.bottom, margins.top]);

    const xScale = scaleBand()
        .padding(0.5)
        .domain(data.map(d => d.date))
        .range([margins.left, dimensions.width - margins.right]);

    const scales = {xScale, yScale};

    // if user clicked on the show button - start render
    const renderElements = () => {
        if (context.isRenderStarted) {
            return (
                <Aux>
                    <Line
                        forwardRef={level1}
                        scales={scales}
                        margins={margins}
                        data={data}
                        maxVal={maxVal}
                        dimensions={dimensions}
                    />
                    <Axes
                        forwardRef={level2}
                        scales={scales}
                        margins={margins}
                        dimensions={dimensions}
                    />
                    <Bars
                        forwardRef={level2}
                        scales={scales}
                        margins={margins}
                        data={data}
                        maxVal={maxVal}
                        dimensions={dimensions}
                    />
                </Aux>
            );
        }
    };

    return (
        <svg width={window.innerWidth} height={500}>
            <g ref={level1}>
                <g ref={level2}>
                    <g ref={level3}>
                        <Canvas
                            forwardRef={level3}
                            scales={scales}
                            margins={margins}
                            data={data}
                            maxVal={maxVal}
                            dimensions={dimensions}
                        />
                    </g>
                    {renderElements()}
                </g>
            </g>
        </svg>
    );
}
