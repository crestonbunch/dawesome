import * as redux from "redux";
import { Note } from "lib/audio/interfaces";

import { InstrumentStore, CreateInstrumentAction, CREATE_INST_ACTION } from "components/containers/instrument";
import { OscillatorStore, CreateOscillatorAction, CREATE_OSC_ACTION } from "components/containers/oscillator";
import { CreateTrackAction, CREATE_TRACK_ACTION } from "components/containers/track";
import { TabStore } from "components/containers/tabs";

/**
 * State is a representation of the global application state.
 */
export interface State {
    /**
     * Playing indicates whether or not the song is currently playng.
     */
    playing: boolean,
    /**
     * Location indicates the time (in seconds) to start playing from. 
     */
    location: number,
    /**
     * Tabs stores the list and currently selected tabs in the application.
     */
    tabs: Map<string, TabStore>,
    /**
     * Tracks is a mapping from instrument id => list of notes that the
     * instrument is responsible for playing.
     */
    tracks: Map<string, Note[]>,
    /**
     * Instruments is a list of instrument ids and a corresponding instrument
     * store.
     */
    instruments: Map<string, InstrumentStore>,
    /**
     * Oscillators is a list of oscillator ids and a corresponding oscillator
     * store. Each oscillator belongs to exactly one instrument (ids are
     * tracked in the instrument store.)
     */
    oscillators: Map<string, OscillatorStore>
}

export type Store = redux.Store<State>;

const createInstrument = (instrument: string, osc: string[]): CreateInstrumentAction => ({
    type: CREATE_INST_ACTION,
    instrument: instrument,
    oscillators: osc,
});

const createOsc = (name: string): CreateOscillatorAction => ({
    type: CREATE_OSC_ACTION,
    osc: name,
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
        const oscillators = [
            name + "_osc1",
            name + "_osc2",
            name + "_osc3",
            name + "_osc4",
            name + "_osc5"
        ]

        store.dispatch(createTrack(name, track));
        store.dispatch(createInstrument(name, oscillators));
        oscillators.forEach(osc => {
            store.dispatch(createOsc(osc));
        });
    });
}
