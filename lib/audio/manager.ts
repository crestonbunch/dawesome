import * as redux from "redux";

import { State } from "lib/state";
import { Note } from "lib/audio/interfaces";
import { Synth } from "lib/audio/synth";
import { InstrumentStore } from "components/containers/instrument";
import { OscillatorStore } from "components/containers/oscillator";

export class AudioManager {

    public readonly context: AudioContext;

    private store: redux.Store<State>;
    private playing: boolean = false;
    private location: number = 0.0;

    private synthMap: Map<string, Synth.Synth> = new Map<string, Synth.Synth>();
    private oscMap: Map<string, Synth.RingModulator> = new Map<string, Synth.RingModulator>();

    constructor() {
        this.context = new AudioContext();
        this.context.suspend();
    }

    buildSynths(instruments: Map<string, InstrumentStore>, oscillators: Map<string, OscillatorStore>) {
        instruments.forEach((inst, name) => {
            if (!this.synthMap.has(name)) {
                // Create a new synth for ones that do not exist yet
                this.synthMap.set(name, new Synth.Synth(this.context));
            }
            const synth = this.synthMap.get(name);
            inst.oscillators.forEach(name => {
                // Configure each oscillator on the current synth
                const osc = oscillators.get(name);
                const mixes = inst.mixes.get(name);
                if (!this.oscMap.has(name)) {
                    // Create a new oscillator for ones that do not exist yet
                    const gen = new Synth.RingModulator(this.context);
                    this.oscMap.set(name, gen);
                    synth.attach(gen);
                }
                if (osc) {
                    const gen = this.oscMap.get(name);
                    gen.partials = osc.partials;
                    gen.signals = inst.oscillators
                        .filter((name) => oscillators.has(name))
                        .map((name) => oscillators.get(name).partials);
                    gen.weights = mixes || Array
                        .apply(null, Array(gen.signals.length))
                        .map(Number.prototype.valueOf,0);
                    gen.gain = inst.gains.get(name) || 0.0;
                }
            });

            synth.out.connect(this.context.destination);
        });
    }

    schedule(tracks: Map<string, Note[]>, offset: number) {
        tracks.forEach((track, name) => {
            const synth = this.synthMap.get(name);
            if (synth) {
                track.forEach(note => {
                    synth.schedule(note, offset);
                });
            }
        });
    }

    free() {
        this.synthMap.forEach(synth => {
            synth.free();
        });
    }

    play() {
        this.playing = true;
        this.context.resume();
    }

    pause() {
        this.context.suspend();
        this.playing = false;
    }

    subscribe(store: redux.Store<State>) {
        this.store = store;
        this.store.subscribe(() => this.subscriber());
    }

    subscriber() {
        const state = this.store.getState();
        this.buildSynths(state.instruments, state.oscillators);

        if (state.playing && !this.playing) {
            // start playing
            this.schedule(state.tracks, state.location);
            this.play();
        } else if (!state.playing && this.playing) {
            // stop playing
            this.pause();
            this.free();
        }
    }

}