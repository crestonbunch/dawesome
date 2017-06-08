import * as React from "react";
import * as redux from "redux";
import * as d3 from "d3";
import { connect } from "react-redux";

import { State } from "lib/state";
import { deleteEdge } from "components/graph/actions";

export interface EdgeProps {
    start: {x: number, y: number};
    end: {x: number, y: number};
    id?: string;
    graph?: string;
    onDelete?: () => void;
}

const mapStore = (store: State, props: EdgeProps): EdgeProps => ({
    ...props,
    ...props.graph ? store.graphs.get(props.graph).edges.get(props.id) : {},
})

const mapDispatch = (dispatch: redux.Dispatch<State>, props: EdgeProps): EdgeProps => ({
    ...props,
    onDelete: () => dispatch(deleteEdge(props.graph, props.id))
});

@(connect(mapStore, mapDispatch) as any)
export default class Edge extends React.PureComponent<EdgeProps, undefined> {

    private path: SVGPathElement;

    draw() {
        const maxX = this.props.end.x - this.props.start.x;
        const maxY = this.props.end.y - this.props.start.y;

        const xScale = d3.scaleLinear()
            .domain([this.props.start.x, this.props.end.x])
            .range([0, maxX]);
        const yScale = d3.scaleLinear()
            .domain([this.props.start.y, this.props.end.y])
            .range([0, maxY]);

        const line = d3.line<{x: number, y: number}>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3.curveBasis);

        const midX = this.props.start.x + (this.props.end.x - this.props.start.x) / 2
        const points = [
            this.props.start,
            {x: midX, y: this.props.start.y},
            {x: midX, y: this.props.end.y},
            this.props.end
        ]

        const path = d3.select(this.path)
            .datum(points)
            .attr('d', line);
    }

    componentDidUpdate() {
        this.draw();
    }

    componentDidMount() {
        this.draw();
    }

    render() {
        // the buffer prevents clipping at the edges
        const bufferFactor = 2.0;
        let width = bufferFactor * Math.abs(this.props.end.x - this.props.start.x);
        let height = bufferFactor * Math.abs(this.props.end.y - this.props.start.y);
        width = Math.max(width, 10.0)
        height = Math.max(height, 10.0)

        const delX = width + (this.props.end.x - this.props.start.x) / 2;
        const delY = height + (this.props.end.y - this.props.start.y) / 2;

        // Create a box with the (0, 0) point at the start.
        return <div style={{position: "absolute", top:this.props.start.y, left:this.props.start.x, zIndex: 0}}>
            {
                // Create a nested box centered at the start point.
            }
            <div 
                className="edge"
                style={{position: "relative", top: -height, left: -width}}
            >
                {
                    // Create a path with the start (x,y) mapped to (0,0) and the
                    // end (x,y) mapped to (width, height)
                }
                <svg 
                    viewBox={-width + " " + -height + " " + 2*width + " " + 2*height}
                    width={2*width} height={2*height}>
                    <path className="line" ref={(ref) => this.path = ref} />
                </svg>
                <div className="delete" style={{position: "absolute", top: delY, left: delX}}>
                    <i className="icon-cross" onClick={(e) => this.props.onDelete()} />
                </div>
            </div>
        </div>
    }
}

