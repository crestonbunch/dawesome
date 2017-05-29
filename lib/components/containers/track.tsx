import { Provider } from "react-redux";
import { createStore } from "redux";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Note } from "lib/audio/interfaces";
import { Action } from "components/interfaces";

export const CREATE_TRACK_ACTION = "CREATE_TRACK";

export interface TrackProps {
}

export interface TrackDispatch {
}

export class Track extends React.PureComponent<TrackProps & TrackDispatch, undefined> {
    render() {
        return <div></div>;
    }
}

export interface TrackAction extends Action {
    track: Note[];
}

export interface CreateTrackAction extends TrackAction {
    instrument: string;
}

export function trackReducer(
    state = new Map<string, Note[]>(), action: TrackAction): Map<string, Note[]>
{
    const newState = new Map<string, Note[]>(state);
    switch (action.type) {
        case CREATE_TRACK_ACTION:
            newState.set((action as CreateTrackAction).instrument, action.track);
            return newState;
        default:
            return newState;
    }
}
