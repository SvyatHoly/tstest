import React, {useEffect, useRef} from 'react'
import * as d3Axis from 'd3'
import {select as d3Select} from 'd3'

import './Axis.css'

const axis = (props) => {
    const {translate, orient, scale, tickSize, forwardRef} = props;

    const axisElement = useRef(null);

    useEffect(() => {
        renderAxis()
    }, [forwardRef]);

    const renderAxis = () => {
        const axisType = `axis${orient}`;
        const axis = d3Axis[axisType]()
            .scale(scale)
            .tickSize(-tickSize)
            .tickPadding([12])
            .ticks([4]);

        if (orient === 'Bottom') {
            axis.tickSizeInner(0)
        }

        d3Select(axisElement.current).call(axis)
            .attr('opacity', 0)
            .transition()
            .duration(2500)
            .attr('opacity', 1)
    };

    return (
        <g
            className={`Axis Axis-${orient}`}
            ref={axisElement}
            transform={translate}
        />
    )
};

export default axis;