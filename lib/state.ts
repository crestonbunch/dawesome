import * as redux from "redux";
import { Note } from "lib/audio/interfaces";

import { ControlState } from "components/controls/state";
import { TabState } from "components/tabs/state";
import { InstrumentState } from "components/instrument/state";
import { GraphState } from "components/graph/state";
import { CREATE_INST_ACTION, CreateInstrumentAction } from "components/instrument/actions";
import { CREATE_TRACK_ACTION, CreateTrackAction } from "components/track/actions";
import { addNode } from "components/graph/actions";

/**
 * State is a representation of the global application state.
 */
export interface State {
    controls: ControlState,
    tabs: Map<string, TabState>,
    graphs: Map<string, GraphState>,
    instruments: Map<string, InstrumentState>,
    tracks: Map<string, Note[]>,
}

export type Store = redux.Store<State>;

const createInstrument = (instrument: string, input: string, output: string): CreateInstrumentAction => ({
    type: CREATE_INST_ACTION,
    instrument: instrument,
    input: input,
    output: output,
});

const createTrack = (instrument: string, track: Note[]): CreateTrackAction => ({
    type: CREATE_TRACK_ACTION,
    instrument: instrument,
    track: track,
});

/**
 * Initialize a store from the given instruments by dispatching the appropriate
 * actions.
 * 
 * @param store 
 * @param instruments 
 */
export function initStore(store: redux.Store<any>, tracks: Note[][]) {
    tracks.forEach((track, i) => {
        const name = "inst" + i;
        store.dispatch(createTrack(name, track));
        store.dispatch(addNode(name, "in", 100, 100));
        store.dispatch(addNode(name, "out", 300, 100));
        store.dispatch(createInstrument(name, "in", "out"));
    });
}
