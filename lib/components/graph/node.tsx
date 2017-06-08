import * as React from "react";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";
import { default as Expanded } from "components/graph/expanded";
import { default as Collapsed } from "components/graph/collapsed";
import { default as Dragger } from "components/graph/dragger";
import { default as Toggler } from "components/graph/toggler";
import { default as Anchor } from "components/graph/anchor";
import { default as Deleter } from "components/graph/deleter";
import { moveNode, toggleNode, deleteNode } from "components/graph/actions";

export interface NodeProps {
    id: string;
    graph: string;
    pos: {x: number, y: number};
    expanded: boolean;
    pageToWorld: (x: number, y: number) => {x: number, y: number};
    onDrag?: (x: number, y: number) => void;
    onToggle?: (expanded: boolean) => void;
    onDelete?: () => void;
}

const mapStore = (store: State, props: NodeProps): NodeProps => {
    return {
        ...props,
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: NodeProps): NodeProps => ({
    ...props,
    onDrag: (x, y) => {
        const pos = props.pageToWorld(x, y);
        return dispatch(moveNode(props.graph, props.id, pos.x, pos.y))
    },
    onToggle: (expanded) => dispatch(toggleNode(props.graph, props.id, expanded)),
    onDelete: () => dispatch(deleteNode(props.graph, props.id)),
});

@(connect(mapStore, mapDispatch) as any)
export default class Node extends React.PureComponent<NodeProps, undefined> {

    private anchors = new Array<Anchor>();

    handleDrag(x: number, y: number) {
        this.props.onDrag(x, y);
        this.anchors.forEach((anchor) => {
            anchor.move();
        });
    }

    handleToggle() {
        this.props.onToggle(!this.props.expanded);
        // This is an unfortunately hacky solution to force the edges to
        // redraw themselves. I'm not sure why other solutions aren't working.
        this.setState({}, () => {
            this.anchors.forEach((anchor) => {
                anchor.setState({}, () => {
                    anchor.move();
                });
            });
        });
    }

    handleDelete() {
        this.props.onDelete();
        this.anchors.forEach((anchor) => {
            anchor.delete();
        });
    }

    addAnchor(anchor: Anchor) {
        this.anchors.push(anchor);
    }

    private transformChildren(children: any): any {
        return React.Children.map(children, (child: any) => {
            if (!child) { return child; }
            if (child.type === Collapsed || child.type === Expanded) {
                return React.cloneElement(
                    child,
                    {expanded: this.props.expanded},
                    this.transformChildren(child.props.children)
                )
            } else if (child.type === Dragger) {
                return React.cloneElement(
                    child,
                    {onDrag: (x:number, y:number) => this.handleDrag(x, y)},
                    this.transformChildren(child.props.children)
                )
            } else if (child.type === Toggler) {
                return React.cloneElement(
                    child,
                    {onToggle: () => this.handleToggle()},
                    this.transformChildren(child.props.children)
                )
            } else if (child.type === Anchor) {
                return React.cloneElement(
                    child,
                    {
                        pageToWorld: this.props.pageToWorld,
                        graph: this.props.graph,
                        node: this,
                    },
                    this.transformChildren(child.props.children)
                )
            } else if (child.type === Deleter) {
                return React.cloneElement(
                    child,
                    {onDelete: () => this.handleDelete()},
                    this.transformChildren(child.props.children)
                )
            } else if (child.props) {
                return React.cloneElement(
                    child,
                    {},
                    this.transformChildren(child.props.children)
                )
            } else {
                return child;
            }
        });
    }

    render() {
        const children = this.transformChildren(this.props.children);
        return <div
            className="node"
            style={{
                left: this.props.pos.x + "px",
                top: this.props.pos.y + "px",
            }}
        >
            {children}
        </div>
    }
}


