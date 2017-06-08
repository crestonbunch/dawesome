import * as React from "react";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";
import { addEdge, moveAnchor, dragAnchor, releaseAnchor, deleteAnchor } from "components/graph/actions";
import { default as Node } from "components/graph/node";
import { default as Edge } from "components/graph/edge";

export interface AnchorProps {
    id: string;
    direction: "in"|"out";
    position: "top"|"middle"|"bottom";
    for: string;
    param: string;
    color: "green"|"blue"|"red";
    graph?: string;
    node?: Node;
    dragging?: boolean;
    edge?: {x: number, y: number};
    onDrag?: (x: number, y: number) => void;
    onRelease?: () => void;
    pageToWorld?: (x: number, y: number) => {x: number, y: number};
    onConnect?: (
        id: string, 
        from: string, 
        fromParam: string,
        fromAnchor: string, 
        to: string, 
        toParam: string,
        toAnchor: string, 
        start: {x: number, y: number}, 
        end: {x: number, y: number}
    ) => void;
    onUpdate?: (x: number, y: number) => void;
    onDelete?: () => void;
}

const mapStore = (store: State, props: AnchorProps): AnchorProps => {
    return {
        ...props,
        ...store.graphs.get(props.graph).anchors.get(props.id)
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: AnchorProps): AnchorProps => ({
    ...props,
    onDrag: (x, y) => dispatch(dragAnchor(props.graph, props.id, x, y)),
    onRelease: () => dispatch(releaseAnchor(props.graph, props.id)),
    onConnect: (id, from, p1, a1, to, p2, a2, start, end) => dispatch(
        addEdge(props.graph, id, from, p1, a1, to, p2, a2, start, end)
    ),
    onUpdate: (x, y) => dispatch(moveAnchor(props.graph, props.id, x, y)),
    onDelete: () => dispatch(deleteAnchor(props.graph, props.id)),
});

@(connect(mapStore, mapDispatch) as any)
export default class Anchor extends React.PureComponent<AnchorProps, undefined> {

    private ref: HTMLElement;
    private absCenter: {x: number, y: number};
    private relCenter: {x: number, y: number};

    componentDidMount() {
        // Each anchor attaches itself to the parent node so that it can be
        // tracked when the node moves. It's not a very elegant data flow
        // pattern, but it is simple.
        this.props.node.addAnchor(this);
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        const box = this.ref.getBoundingClientRect();
        const x = (box.right - box.left) / 2;
        const y = (box.bottom - box.top) / 2;
        this.relCenter = {x: x, y: y};
        this.absCenter = {x: box.left + x, y: box.top + y};
    }

    /**
     * Dispatch an action that moves edges attached to this anchor. This is
     * called by the parent node after an anchor attaches itself.
     */
    move() {
        const pos = this.props.pageToWorld(this.absCenter.x, this.absCenter.y);
        this.props.onUpdate(pos.x, pos.y);
    }

    delete() {
        this.props.onDelete();
    }

    private onDrop(e: React.DragEvent<HTMLDivElement>) {
        const id = Date.now().toString();
        const from = e.dataTransfer.getData("text/for+anchor");
        const fromParam = e.dataTransfer.getData("text/param+anchor");
        const fromAnchor = e.dataTransfer.getData("text/anchor+anchor");
        const x = e.dataTransfer.getData("text/x+anchor");
        const y = e.dataTransfer.getData("text/y+anchor");
        const to = this.props.for;
        const toParam = this.props.param;
        const toAnchor = this.props.id;
        const start = {x: parseFloat(x), y: parseFloat(y)};
        const end = this.props.pageToWorld(this.absCenter.x, this.absCenter.y);
        this.props.onConnect(id, from, fromParam, fromAnchor, to, toParam, toAnchor, start, end);
    }

    private onDragOver(e: React.DragEvent<HTMLDivElement>) {
        if (e.dataTransfer.types.reduce((accum, type) => {
            return accum || (type == "text/for+anchor");
        }, false)) {
            // data contains an edge id -- allow drop
            e.preventDefault();
        }
    }

    private onDragStart(e: React.DragEvent<HTMLDivElement>) {
        const box = this.ref.getBoundingClientRect();
        const x = (e.pageX||e.clientX) - box.left;
        const y = (e.pageY||e.clientY) - box.top;
        const start = this.props.pageToWorld(this.absCenter.x, this.absCenter.y);
        e.dataTransfer.setData("text/for+anchor", this.props.for);
        e.dataTransfer.setData("text/param+anchor", this.props.param);
        e.dataTransfer.setData("text/anchor+anchor", this.props.id);
        e.dataTransfer.setData("text/x+anchor", start.x.toString());
        e.dataTransfer.setData("text/y+anchor", start.y.toString());
        this.props.onDrag(x, y);
    }

    private onDrag(e: React.DragEvent<HTMLDivElement>) {
        const box = this.ref.getBoundingClientRect();
        const x = (e.pageX||e.clientX) - box.left;
        const y = (e.pageY||e.clientY) - box.top;
        this.props.onDrag(x, y);
    }

    private onDragEnd(e: React.DragEvent<HTMLDivElement>) {
        const box = this.ref.getBoundingClientRect();
        const x = (e.pageX||e.clientX) - box.left;
        const y = (e.pageY||e.clientY) - box.top;
        this.props.onDrag(x, y);
        this.props.onRelease();
    }

    render() {
        if (this.props.direction === "in") {
            return <div className={"anchor in container " + this.props.position}
                ref={(ref) => this.ref = ref}
                onDrop={(e) => this.onDrop(e)}
                onDragOver={(e) => this.onDragOver(e)}
            ><div className={"anchor in handle " + this.props.color} 
                ref={(ref) => this.ref = ref}
                />
            </div>
        } else if (this.props.direction === "out") {
            return <div className={"anchor out container " + this.props.position}
                ref={(ref) => this.ref = ref}
            ><div className={"anchor out handle " + this.props.color}
                draggable={true}
                onDragStart={(e) => this.onDragStart(e) } 
                onDrag={(e) => this.onDrag(e)} 
                onDragEnd={(e) => this.onDragEnd(e)} />
            {(this.props.dragging) ? <Edge start={this.relCenter} end={this.props.edge} /> : null }
            </div>
        }
    }
}
