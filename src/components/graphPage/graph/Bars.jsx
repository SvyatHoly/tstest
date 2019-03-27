import React, {Component} from 'react'
import * as d3 from 'd3'
import {interpolateLab, scaleLinear} from 'd3'
import './Bars.css'
import Aux from '../../../hoc/Aux/Aux'

export default class Bars extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            sRef: null,
            attr: null,
            isChanged: false
        };

        this.green = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#F3E5F5', '#40a200'])
            .interpolate(interpolateLab);

        this.red = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#F3E5F5', '#a20a19'])
            .interpolate(interpolateLab);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {data} = this.props;

        if (prevProps.data !== data) {
            const refArr = data.map(el => ({ref: React.createRef(), id: el.date}));
            this.setState({sRef: refArr});
        }
    }

    attributes = [];

    barClickHandler = (id) => {
        const {sRef} = this.state;
        const {json} = this.props;
        const data = json.data.filter(x => x.date === id);

        const textData = JSON.stringify(data);
        const refById = sRef.find(x => x.id === id).ref;
        let el = d3.select(refById.current);
        if (this.attributes.length === 0 || this.attributes[0].id !== id) {
            const node = {
                el: el,
                id: id,
                x: el._groups[0][0].attributes[1].nodeValue,
                y: el._groups[0][0].attributes[2].nodeValue,
                height: el._groups[0][0].attributes[3].nodeValue,
                width: el._groups[0][0].attributes[4].nodeValue,
                fill: el._groups[0][0].attributes[5].nodeValue,
                show: true
            };
            this.attributes.push(node);
            this.barTransition(node, textData);
        } else {
            this.barTransition({...this.attributes.pop(), show: false}, textData);
        }

        while (this.attributes.length > 1) {
            this.barTransition({...this.attributes.shift(), show: false}, textData)
        }
    };

    barTransition = (node, textData) => {

        const {forwardRef} = this.props;
        let svg = d3.select(forwardRef.current);
        const {x, y, height, width, fill, el, show, id} = node;

        const text = svg.append('text');

        if (show) {
            textData.split(',').forEach(el => {

                text.append('tspan')
                    .text(el.replace(/[[\]}{"]+/g, ' '))
                    .attr('dy', '1em')
                    .attr('x', 2000)
                    .attr('class', 'text' + id.replace(/\.+/g, ''))
            });
            text
                .attr("y", 150)
                .attr("x", 2000)
                .attr('id', 'text' + id.replace(/\.+/g, ''));


            el.transition()
                .duration(800)
                .attr("y", 100)
                .attr("x", 900)
                .attr('width', 300)
                .attr('height', 300)
                .attr('fill', '#5f9cb1')
                .on("start", () => {
                    svg.selectAll('.text' + id.replace(/\.+/g, ''))
                        .transition()
                        .duration(800)
                        .attr("x", 950);
                })
        } else {
            const tspan = svg.selectAll('tspan');
            tspan
                .transition()
                .duration(800)
                .attr("x", 2000)
                .on('end', () => {
                    d3.select('#text' + id.replace(/\.+/g, '')).remove()
                });
            el.transition()
                .duration(800)
                .attr("y", y)
                .attr("x", x)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', fill)
        }
    };


    render() {
        const {scales, margins, data, svgDimensions} = this.props;
        const {sRef} = this.state;
        const {xScale, yScale} = scales;
        const {height} = svgDimensions;
        let bars = null;

        if (sRef) {
            bars = data.map((datum, i) => {
                const yPlan = yScale(datum.plan);
                const y = yScale(datum.actual) - 10;
                return (
                    <Aux key={datum.date}>
                        <text

                            x={xScale(datum.date) - 10}
                            y={Math.abs(yPlan - y) > 20 ? y : y - 20}
                            fill={'#c6cfc9'}
                        >
                            {datum.actual}
                        </text>
                        <rect
                            ref={sRef[i].ref}
                            className="bar"
                            x={xScale(datum.date)}
                            y={yScale(datum.actual)}
                            height={(height - margins.bottom - Math.abs(yScale(datum.actual)))}
                            width={xScale.bandwidth()}
                            fill={datum.actual >= datum.plan ?
                                this.green(datum.actual) : this.red(datum.actual)}
                            onClick={() => this.barClickHandler(datum.date)}
                        />
                    </Aux>
                )
            })
        }

        return (
            <g>{bars}</g>
        )
    }
}