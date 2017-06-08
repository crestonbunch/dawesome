import * as React from "react";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";
import { addNode } from "components/graph/actions";
import { default as Node } from "components/graph/node";
import { default as Edge } from "components/graph/edge";
import { default as Anchor } from "components/graph/anchor";
import { NodeState, EdgeState, AnchorState } from "components/graph/state";

export interface GraphProps {
    name: string;
    buildNode: (id: string) => React.ReactElement<any>;
    nodes?: Map<string, NodeState>;
    anchors?: Map<string, AnchorState>;
    edges?: Map<string, EdgeState>;
    camera?: {x: number, y: number};
    addNode?: (id: string, x: number, y: number) => void;
}

const mapStore = (store: State, props: GraphProps): GraphProps => {
    return {
        ...props,
        ...store.graphs.get(props.name),
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: GraphProps): GraphProps => ({
    ...props,
    addNode: (id, x, y) => dispatch(addNode(props.name, id, x, y))
});

@(connect(mapStore, mapDispatch) as any)
export default class Graph extends React.PureComponent<GraphProps, undefined> {

    /**
     * Retain a reference to the parent div element for this graph, which allows
     * us to calculate the relative positions of nodes inside the graph view.
     */
    private ref: HTMLDivElement;
    
    /**
     * Convert page coordinates to coordinates in the graph world.
     * 
     * @param x
     * @param y 
     */
    private pageToWorld(x: number, y: number) {
        const camera = this.props.camera || {x: 0, y: 0};
        return {
            x: x - this.ref.offsetLeft + camera.x,
            y: y - this.ref.offsetTop + camera.y
        }
    }

    /**
     * Convert graph world coordinates into coordinates relative to the camera.
     * 
     * @param x
     * @param y 
     */
    private worldToCamera(x: number, y: number) {
        const camera = this.props.camera || {x: 0, y: 0};
        return {
            x: x - camera.x,
            y: y - camera.y,
        }
    }

    /**
     * Handle actions when a graph spawner is dropped onto this graph. It
     * creates a node with the id contained in the drop data transfer, then
     * calls the addNode() callback assigned to the graph props.
     * 
     * @param e
     */
    private onDrop(e: React.DragEvent<HTMLDivElement>) {
        const id = e.dataTransfer.getData("text/id+node");
        const pos = this.pageToWorld(e.pageX, e.pageY);
        this.props.addNode(id, pos.x, pos.y);
    }

    private onDragOver(e: React.DragEvent<any>) {
        if (e.dataTransfer.types.reduce((accum, type) => {
            return accum || (type == "text/id+node");
        }, false)) {
            // data contains a node id
            e.preventDefault();
        }
    }

    /**
     * Bulid a list of elements to render by calling the buildNode() callback
     * property for each node id.
     */
    private buildNodes(): React.ReactElement<Node>[] {
        const nodes = this.props.nodes || new Map<string, NodeState>();
        const out = new Array<React.ReactElement<Node>>();
        nodes.forEach((state) => {
            const pos = this.worldToCamera(state.pos.x, state.pos.y);
            out.push(<Node 
                key={state.id} 
                id={state.id}
                graph={this.props.name}
                pos={pos} 
                expanded={state.expanded}
                pageToWorld={(x, y) => this.pageToWorld(x, y)}
            >
                {this.props.buildNode(state.id)}
            </Node>);
        });
        return out;
    }

    private buildEdges(): React.ReactElement<Edge>[] {
        const edges = this.props.edges || new Map<string, EdgeState>();
        const out = new Array<React.ReactElement<Edge>>();
        edges.forEach((state) => {
            const start = this.worldToCamera(state.start.x, state.start.y);
            const end = this.worldToCamera(state.end.x, state.end.y);
            out.push(<Edge
                id={state.id}
                graph={state.graph}
                key={state.id}
                start={start}
                end={end}
            />)
        });
        return out;
    }

    render() {
        const nodes = this.buildNodes();
        const edges = this.buildEdges();
        return <div 
            className="graph"
            ref={(ref) => this.ref = ref}
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e)} 
            style={{position: "relative"}}
        >
            {edges}
            {nodes}
        </div>
    }
}
