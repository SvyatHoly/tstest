import React from 'react';
import * as PropTypes from 'prop-types';
import Axis from './Axis';

axes.propTypes = {
    scales: PropTypes.object,
    margins: PropTypes.object,
    dimensions: PropTypes.object,
    forwardRef: PropTypes.object
};

export default function axes({scales, margins, dimensions, forwardRef}) {
    const {height, width} = dimensions;
    const xProps = {
        orient: 'Bottom',
        scale: scales.xScale,
        translate: `translate(0, ${height - margins.bottom})`,
        tickSize: height - margins.top - margins.bottom,
    };

    const yProps = {
        orient: 'Left',
        scale: scales.yScale,
        translate: `translate(${margins.left}, 0)`,
        tickSize: width - margins.left - margins.right,
    };

    return (
        <g>
            <Axis {...xProps} forwardRef={forwardRef}/>
            <Axis {...yProps} forwardRef={forwardRef}/>
        </g>
    );
}