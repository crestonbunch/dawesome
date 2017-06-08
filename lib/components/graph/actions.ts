import * as React from "react";
import { Action } from "components/interfaces";

export const ADD_NODE_ACTION = "ADD_NODE";
export const START_DRAG_ACTION = "START_GRAPH_DRAG";
export const STOP_DRAG_ACTION = "STOP_GRAPH_DRAG";
export const MOVE_CAMERA_ACTION = "MOVE_CAMERA";
export const MOVE_NODE_ACTION = "MOVE_NODE";
export const TOGGLE_NODE_ACTION = "TOGGLE_NODE";
export const DELETE_NODE_ACTION = "DELETE_NODE";
export const ADD_EDGE_ACTION = "ADD_EDGE";
export const DELETE_EDGE_ACTION = "DELETE_EDGE";
export const DRAG_ANCHOR_ACTION = "DRAG_ANCHOR";
export const RELEASE_ANCHOR_ACTION = "RELEASE_ANCHOR";
export const MOVE_ANCHOR_ACTION = "MOVE_ANCHOR";
export const DELETE_ANCHOR_ACTION = "DELETE_ANCHOR";

export interface GraphAction extends Action {
    graph: string;
}

export interface AddNodeAction extends GraphAction {
    id: string,
    pos: {x: number, y: number};
}

export interface StartDragAction extends GraphAction {
}

export interface StopDragAction extends GraphAction {
}

export interface MoveCameraAction extends GraphAction {
    dx: number;
    dy: number;
}

export interface MoveNodeAction extends GraphAction {
    id: string;
    pos: {x: number, y: number};
}

export interface DeleteNodeAction extends GraphAction {
    id: string
}

export interface ToggleNodeAction extends GraphAction {
    id: string,
    expanded: boolean
}

export interface AddEdgeAction extends GraphAction {
    id: string,
    from: string,
    fromParam: string,
    fromAnchor: string,
    to: string,
    toParam: string,
    toAnchor: string,
    start: {x: number, y: number},
    end: {x: number, y: number}
}

export interface DeleteEdgeAction extends GraphAction {
    id: string
}

export interface DragAnchorAction extends GraphAction {
    id: string,
    x: number,
    y: number,
}

export interface ReleaseAnchorAction extends GraphAction {
    id: string,
}

export interface MoveAnchorAction extends GraphAction {
    id: string,
    x: number,
    y: number,
}

export interface DeleteAnchorAction extends GraphAction {
    id: string
}

export const addNode = (graph: string, id: string, x: number, y: number): AddNodeAction => ({
    type: ADD_NODE_ACTION,
    graph: graph,
    id: id,
    pos: {x: x, y: y},
});

export const startDragging = (graph: string): StartDragAction => ({
    type: START_DRAG_ACTION,
    graph: graph,
});

export const stopDragging = (graph: string): StopDragAction => ({
    type: STOP_DRAG_ACTION,
    graph: graph,
});

export const moveCamera = (graph: string, dx: number, dy: number): MoveCameraAction => ({
    type: MOVE_CAMERA_ACTION,
    graph: graph,
    dx: dx,
    dy: dy
});

export const moveNode = (graph: string, id: string, x: number, y: number): MoveNodeAction => ({
    type: MOVE_NODE_ACTION,
    graph: graph,
    id: id,
    pos: {x: x, y: y},
});

export const toggleNode = (graph: string, id: string, expanded: boolean): ToggleNodeAction => ({
    type: TOGGLE_NODE_ACTION,
    graph: graph,
    id: id,
    expanded: expanded
});

export const deleteNode = (graph: string, id: string) => ({
    type: DELETE_NODE_ACTION,
    graph: graph,
    id: id,
});

export const addEdge = (
    graph: string,
    id: string,
    from: string,
    fromParam: string,
    fromAnchor: string,
    to: string,
    toParam: string,
    toAnchor: string,
    start: {x: number, y: number},
    end: {x: number, y: number}
):  AddEdgeAction => ({
    type: ADD_EDGE_ACTION,
    id: id,
    graph: graph,
    to: to,
    toParam: toParam,
    toAnchor: toAnchor,
    from: from,
    fromParam: fromParam,
    fromAnchor: fromAnchor,
    start: start,
    end: end,
});

export const deleteEdge = (graph: string, id: string) => ({
    type: DELETE_EDGE_ACTION,
    graph: graph,
    id: id,
});

export const dragAnchor = (graph: string, id: string, x: number, y: number): DragAnchorAction => ({
    type: DRAG_ANCHOR_ACTION,
    id: id,
    graph: graph,
    x: x,
    y: y,
});

export const releaseAnchor = (graph: string, id: string): ReleaseAnchorAction => ({
    type: RELEASE_ANCHOR_ACTION,
    id: id,
    graph: graph,
});

export const moveAnchor = (graph: string, id: string, x: number, y: number): MoveAnchorAction => ({
    type: MOVE_ANCHOR_ACTION,
    id: id,
    graph: graph,
    x: x,
    y: y,
});

export const deleteAnchor = (graph: string, id: string) => ({
    type: DELETE_ANCHOR_ACTION,
    graph: graph,
    id: id,
});