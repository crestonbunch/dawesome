import { GraphAction } from "components/graph/actions";
import { ADD_NODE_ACTION, AddNodeAction } from "components/graph/actions"
import { MOVE_NODE_ACTION, MoveNodeAction } from "components/graph/actions"
import { TOGGLE_NODE_ACTION, ToggleNodeAction } from "components/graph/actions"
import { DELETE_NODE_ACTION, DeleteNodeAction } from "components/graph/actions"
import { ADD_EDGE_ACTION, AddEdgeAction } from "components/graph/actions"
import { DELETE_EDGE_ACTION, DeleteEdgeAction } from "components/graph/actions"
import { DRAG_ANCHOR_ACTION, DragAnchorAction } from "components/graph/actions"
import { RELEASE_ANCHOR_ACTION, ReleaseAnchorAction } from "components/graph/actions"
import { MOVE_ANCHOR_ACTION, MoveAnchorAction } from "components/graph/actions"
import { DELETE_ANCHOR_ACTION, DeleteAnchorAction } from "components/graph/actions"

export interface NodeState {
    id: string;
    graph: string;
    pos: {x: number, y: number};
    expanded: boolean;
}

export interface EdgeState {
    id: string;
    graph: string;
    from: string;
    to: string;
    start: {x: number, y: number},
    end: {x: number, y: number},
}

export interface AnchorState {
    id: string;
    dragging: boolean;
    edge: {x: number, y: number};
}

export interface GraphState {
    nodes: Map<string, NodeState>;
    anchors: Map<string, AnchorState>;
    edges: Map<string, EdgeState>;
    camera: {x: number, y: number};
}

function addNode(state: Map<string, GraphState>, action: AddNodeAction): Map<string, GraphState> {
    if (!state.has(action.graph)) {
        state.set(action.graph, { 
            nodes: new Map<string, NodeState>(), 
            anchors: new Map<string, AnchorState>(), 
            edges: new Map<string, EdgeState>(),
            camera: {x: 0, y: 0}
        });
    }

    const nodes = new Map<string, NodeState>(state.get(action.graph).nodes);
    nodes.set(action.id, {
        id: action.id,
        graph: action.graph,
        pos: action.pos,
        expanded: true,
    });

    state.get(action.graph).nodes = nodes;

    return state;
}

function moveNode(state: Map<string, GraphState>, action: MoveNodeAction): Map<string, GraphState> {
    const nodes = new Map<string, NodeState>(state.get(action.graph).nodes);
    nodes.get(action.id).pos = action.pos;
    state.get(action.graph).nodes = nodes;
    return state;
}

function toggleNode(state: Map<string, GraphState>, action: ToggleNodeAction): Map<string, GraphState> {
    const nodes = new Map<string, NodeState>(state.get(action.graph).nodes);
    nodes.get(action.id).expanded = action.expanded;
    state.get(action.graph).nodes = nodes;
    return state;
}

function deleteNode(state: Map<string, GraphState>, action: DeleteNodeAction): Map<string, GraphState> {
    const nodes = new Map<string, NodeState>(state.get(action.graph).nodes);
    nodes.delete(action.id);
    state.get(action.graph).nodes = nodes;
    return state;
}


function addEdge(state: Map<string, GraphState>, action: AddEdgeAction): Map<string, GraphState> {
    const edges = new Map<string, EdgeState>(state.get(action.graph).edges);

    edges.set(action.id, {
        id: action.id,
        graph: action.graph,
        from: action.from,
        to: action.to,
        start: action.start,
        end: action.end
    });

    state.get(action.graph).edges = edges;

    return state;
}

function deleteEdge(state: Map<string, GraphState>, action: DeleteEdgeAction): Map<string, GraphState> {
    const edges = new Map<string, EdgeState>(state.get(action.graph).edges);
    edges.delete(action.id);
    state.get(action.graph).edges = edges;

    return state;
}

/**
 * Dragging an anchor changes the end position of the dummy edge coming out of
 * an anchor, and sets the dragging state to true.
 * 
 * @param state 
 * @param action 
 */
function dragAnchor(state: Map<string, GraphState>, action: DragAnchorAction): Map<string, GraphState> {
    const anchors = new Map<string, AnchorState>(state.get(action.graph).anchors);

    const anchor = {
        ...anchors.get(action.id),
        edge: {
            x: action.x,
            y: action.y,
        },
        dragging: true,
    }
    anchors.set(action.id, anchor);
    state.get(action.graph).anchors = anchors;
    return state;
}

function releaseAnchor(state: Map<string, GraphState>, action: ReleaseAnchorAction): Map<string, GraphState> {
    const anchors = new Map<string, AnchorState>(state.get(action.graph).anchors);

    const anchor = {
        ...anchors.get(action.id),
        dragging: false,
    }
    anchors.set(action.id, anchor);
    state.get(action.graph).anchors = anchors;
    return state;
}

/**
 * Moving an anchor moves any edges attached to the anchor, but does not change
 * the anchor state at all.
 * 
 * @param state 
 * @param action 
 */
function moveAnchor(state: Map<string, GraphState>, action: MoveAnchorAction): Map<string, GraphState> {
    const edges = new Map<string, EdgeState>();

    state.get(action.graph).edges.forEach((state, id) => {
        let edge = {...state};
        if (state.from === action.id) {
            edge.start = {x: action.x, y: action.y};
        } else if (state.to === action.id) {
            edge.end = {x: action.x, y: action.y};
        }
        edges.set(id, edge);
    });

    state.get(action.graph).edges = edges;
    return state;
}

function deleteAnchor(state: Map<string, GraphState>, action: DeleteAnchorAction): Map<string, GraphState> {
    const anchors = new Map<string, AnchorState>(state.get(action.graph).anchors);
    const edges = new Map<string, EdgeState>(state.get(action.graph).edges);

    // delete anchor
    anchors.delete(action.id)
    // delete connected edges
    state.get(action.graph).edges.forEach((state, id) => {
        if (state.from === action.id) {
            edges.delete(state.id);
        } else if (state.to === action.id) {
            edges.delete(state.id);
        }
    });

    state.get(action.graph).anchors = anchors;
    state.get(action.graph).edges = edges;
    return state;
}

export default function graphStore(
    state = new Map<string, GraphState>(), action: GraphAction): Map<string, GraphState>
{
    const newState = new Map<string, GraphState>(state);
    switch (action.type) {
        case ADD_NODE_ACTION:
            return addNode(newState, action as AddNodeAction);
        case MOVE_NODE_ACTION:
            return moveNode(newState, action as MoveNodeAction);
        case TOGGLE_NODE_ACTION:
            return toggleNode(newState, action as ToggleNodeAction);
        case DELETE_NODE_ACTION:
            return deleteNode(newState, action as DeleteNodeAction);
        case ADD_EDGE_ACTION:
            return addEdge(newState, action as AddEdgeAction);
        case DELETE_EDGE_ACTION:
            return deleteEdge(newState, action as DeleteEdgeAction);
        case DRAG_ANCHOR_ACTION:
            return dragAnchor(newState, action as DragAnchorAction);
        case RELEASE_ANCHOR_ACTION:
            return releaseAnchor(newState, action as ReleaseAnchorAction);
        case MOVE_ANCHOR_ACTION:
            return moveAnchor(newState, action as MoveAnchorAction);
        case DELETE_ANCHOR_ACTION:
            return deleteAnchor(newState, action as DeleteAnchorAction);
        default:
            return newState;
    }
}
