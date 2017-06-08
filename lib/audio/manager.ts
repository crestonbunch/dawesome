import * as redux from "redux";

import { partialsToFourier } from "lib/audio/math";
import { State } from "lib/state";
import { Note } from "lib/audio/interfaces";
import { Instrument } from "lib/audio/instrument";
import { InstrumentState } from "components/instrument/state";
import { GraphState, EdgeState } from "components/graph/state";

export default class AudioManager {

    public readonly context: AudioContext;

    private playing: boolean = false;
    private location: number = 0.0;
    private store: redux.Store<State>;

    private instruments: Map<string, Instrument>; 

    constructor(store: redux.Store<State>) {
        this.context = new AudioContext();
        this.context.suspend();
        this.location = this.context.currentTime;
        this.store = store;

        this.instruments = new Map<string, Instrument>();
        this.store.subscribe(() => {this.listener()});
    }

    listener() {
        const state = this.store.getState();
        state.instruments.forEach((inst, key) => {
            if (!this.instruments.has(key)) {
                const instrument = new Instrument(this.context, state.tracks.get(key));
                this.instruments.set(key, instrument);
            };
            const instrument = this.instruments.get(key);
            instrument.build(inst, state.graphs.get(key).edges);
        });
        // schedules any new oscillators
        this.schedule(state.controls.location);

        if (state.controls.playing && !this.playing) {
            this.play();
        } else if (!state.controls.playing && this.playing) {
            this.pause();
        }
    }

    /**
     * Schedules oscillators to play for each note.
     */
    schedule(offset: number) {
        this.instruments.forEach(inst => {
            inst.schedule(offset);
        });
    }

    /**
     * Stops all oscillators from playing.
     */
    reset() {
        this.instruments.forEach(inst => {
            inst.reset();
        });
        // Update the location where the context was reset, so we can
        // calculate a new start time.
        this.location = this.context.currentTime;
    }

    /**
     * Resume the audio context and return the current time.
     */
    play(): number {
        this.playing = true;
        this.context.resume();
        return this.context.currentTime;
    }

    /**
     * Suspend the audio context and return the current time.
     */
    pause(): number {
        this.context.suspend();
        this.playing = false;
        return this.context.currentTime;
    }

    /**
     * Get the current playback offset. Returns the relative playback time
     * since the last call to reset().
     */
    get offset(): number {
        return this.context.currentTime - this.location;
    }

}