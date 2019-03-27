import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3'
import './Line.css'

const line = (props) => {
    const {scales, margins, data, svgDimensions, forwardRef} = props;
    const {xScale, yScale} = scales;
    const {width} = svgDimensions;

    const [lineData, setLinePath] = useState(null);
    const [curDate, setCurDate] = useState(null);

    let ref = useRef();

    useEffect(() => {
        if (lineData) renderLine();
    }, [lineData]);

    const createPath = d3
        .line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveMonotoneX);

    const renderLine = () => {

        const p = d3.select(forwardRef.current)
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", createPath(lineData));

        const path = p.node();
        const totalLen = path.getTotalLength();

        let d = xScale(curDate);
        // draw the dashes
        let sd = d,
            dp = d,
            count = 0;
        while (dp < totalLen) {
            dp += 2;
            sd += ", 2";
            count++;
        }
        // per answer below needs odd number of dash array
        if (count % 2 === 0)
            sd += ", 2";
        sd += ", " + (totalLen - d);
        p.attr("stroke-dasharray", sd);
    };

    useEffect(() => {
            let isCurDateSatted = false;

        const preparing = data.map((el, i) => {

            if (el.actualSum===0 && !isCurDateSatted){
                isCurDateSatted = true;
                setCurDate(data[i-1].date)
            }

            if (i === 0) {
                return {
                    x: margins.left,
                    y: yScale(el.planSum)
                }
            } else if (i !== data.length - 1) {
                return {
                    x: xScale(el.date) + xScale.bandwidth() / 2,
                    y: yScale(el.planSum)
                }
            } else {
                return {
                    x: width - margins.right,
                    y: yScale(el.planSum)
                }
            }
        });

        setLinePath(preparing);

        d3.select(ref.current)
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.date) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d.planSum))
            .attr('r', 8)
            .on('mouseover', d => appendChild(d))
            .on('mouseout', d => removeChild(d))

    }, [null]);

    const appendChild = (id) => {
        const info = d3.select(ref.current)
            .append('rect')
            .attr('x', xScale(id.date) + xScale.bandwidth() / 2 - 100)
            .attr('y', 0)
            .attr('width', 200)
            .attr('height', 100)
            .attr('border', '3px solid black')
            .attr('id', 'info' + id.date.replace(/\.+/g, ''))
            .attr('fill', 'transparent');

        const text = d3.select(ref.current)
            .append('text')
            .text('план:  ' + id.planSum)
            .attr('id', 'text' + id.date.replace(/\.+/g, ''))
            .attr('y', 0)
            .attr('x', xScale(id.date) + xScale.bandwidth() / 2 - 50)
            .attr('fill', 'transparent');

        info.transition()
            .duration(300)
            .attr('y', yScale(id.planSum) - 120)
            .attr('fill', '#5f9cb1');

        text.transition()
            .duration(300)
            .attr('y', yScale(id.planSum) - 90)
            .attr('fill', 'white')
    };

    const removeChild = (id) => {
        d3.select('#info' + id.date.replace(/\.+/g, ''))
            .transition()
            .duration(300)
            .attr('y', 0)
            .attr('fill', 'transparent')
            .on('end', () => d3.select('#info' + id.date.replace(/\.+/g, '')).remove());

        d3.select('#text' + id.date.replace(/\.+/g, ''))
            .transition()
            .duration(300)
            .attr('y', 0)
            .attr('fill', 'transparent')
            .on('end', () => d3.select('#text' + id.date.replace(/\.+/g, '')).remove());
    };

    return <g fill={'white'} ref={ref}/>
};

export default line;