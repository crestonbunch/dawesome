import * as React from "react";
import * as ReactDOM from "react-dom";
import * as d3 from "d3";
import "components/presentational/waveform.scss";

/**
 * A Waveform shows the shape of a periodic function.
 */
export interface WaveformProps {
    freq: number;
    partials: Map<number, number>;
    height: number;
    size: number;
    color: "green"|"blue"|"red"|"orange";
    style?: any;
}

export class Waveform extends React.PureComponent<WaveformProps, undefined> {

    readonly numSamples = 300;

    private container: HTMLDivElement;
    private line: any;
    private path: any;
    private range: number[];
    private samples: {x: number, y: number}[];
    private xScale: d3.ScaleLinear<number, number>;
    private yScale: d3.ScaleLinear<number, number>;

    calcPoint(x: number) {
        let y = 0;
        this.props.partials.forEach((amplitude, partial) => {
            y += amplitude * Math.sin(2 * Math.PI * x * this.props.freq * partial);
        });
        const r = {x: x, y: y};
        return r;
    }

    updateScale() {
        const xOffset = 2 * this.props.size;
        const yOffset = 2 * this.props.size;
        const height = this.props.height;
        const width = this.container.offsetWidth;
        const period = 1.0 / this.props.freq;

        const minY = Math.min(-1.0, d3.min(this.samples.map(e => e.y)));
        const maxY = Math.max(1.0, d3.max(this.samples.map(e => e.y)));
        this.xScale = d3.scaleLinear()
            .domain([0, period])
            .range([xOffset, width - xOffset]);
        this.yScale = d3.scaleLinear()
            .domain([minY, maxY])
            .range([height - yOffset, yOffset]);
    }

    componentDidMount() {
        const height = this.props.height;
        const width = this.container.offsetWidth;
        const period = 1.0 / this.props.freq;

        this.range = d3.range(0, period, period / this.numSamples);
        this.samples = this.range.map((e) => this.calcPoint(e));

        this.updateScale();

        this.line = d3.line<{x: number, y: number}>()
            .x((d) => this.xScale(d.x))
            .y((d) => this.yScale(d.y))
            .curve(d3.curveCatmullRom);

        const img = d3.select(this.container)
            .append('svg')
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr('width', width)
            .attr('height', height);

        this.path = img.append('path')
            .attr('class', 'line')
            .data([this.samples])
            .attr('d', this.line)
            .style('fill', 'none')
            .style('stroke-width', this.props.size);
    }
    
    render() {
        if (this.path) {
            this.samples = this.range.map((e) => this.calcPoint(e));
            this.updateScale();
            this.path.data([this.samples]).attr('d', this.line);
        }
        const classes = "waveform " + this.props.color;
        return <div className={classes} ref={e => this.container = e} style={this.props.style}></div>
    }

}

