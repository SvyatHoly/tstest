import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import './Axis.scss';

axis.propTypes = {
    translate: PropTypes.string,
    orient: PropTypes.string,
    tickSize: PropTypes.number,
    forwardRef: PropTypes.object,
    scale: PropTypes.func
};

export default function axis({translate, orient, scale, tickSize, forwardRef}) {
    const axisElement = useRef(null);

    useEffect(() => {
        renderAxis();
    }, [forwardRef]);

    const renderAxis = () => {
        const axisType = `axis${orient}`;
        const axis = d3[axisType]()
            .scale(scale)
            .tickSize(-tickSize)
            .tickPadding([12])
            .ticks([4]);

        if (orient === 'Bottom') {
            axis.tickSizeInner(0);
        }

        d3.select(axisElement.current).call(axis)
            .attr('opacity', 0)
            .transition()
            .duration(2500)
            .attr('opacity', 1);
    };

    return (
        <g
            className={`Axis Axis-${orient}`}
            ref={axisElement}
            transform={translate}
        />
    );
}