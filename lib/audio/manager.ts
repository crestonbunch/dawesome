import * as redux from "redux";

import { partialsToFourier } from "lib/audio/math";
import { State } from "lib/state";
import { Note } from "lib/audio/interfaces";
import { InstrumentState } from "components/instrument/state";
import { GraphState, EdgeState } from "components/graph/state";

interface Instrument {
    notes: Note[];
    oscillators: Map<string, OscillatorNode>;
    gains: Map<string, GainNode>;
    numbers: Map<string, Number>;
    sources: Map<string, GainNode>;
    destinations: Map<string, AudioDestinationNode>;
}

export default class AudioManager {

    public readonly context: AudioContext;

    private playing: boolean = false;
    private location: number = 0.0;
    private store: redux.Store<State>;

    private instruments: Map<string, Instrument>; 

    constructor(store: redux.Store<State>) {
        this.context = new AudioContext();
        this.context.suspend();
        this.store = store;

        this.instruments = new Map<string, Instrument>();
        this.store.subscribe(() => {this.listener});
    }

    listener() {
        const state = this.store.getState();
        state.instruments.forEach((inst, key) => {
            this.buildInstrument(key, inst, state.graphs.get(key));
        });
    }

    buildInstrument(key: string, state: InstrumentState, graph: GraphState) {
        if (!this.instruments.has(key)) {
            this.instruments.set(key, {
                notes: [],
                oscillators: new Map<string, OscillatorNode>(),
                gains: new Map<string, GainNode>(),
                numbers: new Map<string, Number>(),
                sources: new Map<string, GainNode>(),
                destinations: new Map<string, AudioDestinationNode>(),
            });
        }

        const inst = this.instruments.get(key);
        inst.sources.set(state.input, this.context.createGain());
        inst.destinations.set(state.output, this.context.destination);

        this.buildOscillators(key, state.oscillators);
        this.buildGains(key, state.gains);
        this.buildNumbers(key, state.numbers);
        this.connectNodes(key, graph.edges);
    }

    private buildOscillators(inst: string, state: Map<string, Map<number, number>>) {
        state.forEach((partials, id) => {
            if (!this.instruments.get(inst).oscillators.has(id)) {
                const node = this.context.createOscillator();
                this.instruments.get(inst).oscillators.set(id, node);
            }
            const node = this.instruments.get(inst).oscillators.get(id);
            const real = partialsToFourier(new Map<number, number>(), this.context.sampleRate);
            const imag = partialsToFourier(partials, this.context.sampleRate);
            const wave = this.context.createPeriodicWave(real, imag);
            node.setPeriodicWave(wave);
        });
    }

    private buildGains(inst: string, state: Map<string, number>) {
        state.forEach((val, id) => {
            if (!this.instruments.get(inst).gains.has(id)) {
                const node = this.context.createGain();
                this.instruments.get(inst).gains.set(id, node);
            }
            const node = this.instruments.get(inst).gains.get(id);
            node.gain.value = val;
        });
    }

    private buildNumbers(inst: string, state: Map<string, number>) {
        state.forEach((val, id) => {
            this.instruments.get(inst).numbers.set(id, val);
        });
    }

    private connectNodes(inst: string, edges: Map<string, EdgeState>) {
        const instrument = this.instruments.get(inst);
        edges.forEach((edge, id) => {
            const source = this.lookupNode(inst, edge.from);
            const dest = this.lookupNode(inst, edge.to);
            if (source instanceof AudioNode) {
                if (dest instanceof OscillatorNode) {
                    source.connect(dest.frequency);
                } else if (dest instanceof GainNode) {
                    if (edge.toParam === "gain") {
                        source.connect(dest.gain);
                    } else {
                        source.connect(dest);
                    }
                } else if (dest instanceof AudioNode) {
                    source.connect(dest);
                }
            } else if (source instanceof Number) {
                if (dest instanceof OscillatorNode) {
                    dest.frequency.value = source.valueOf();
                } else if (dest instanceof GainNode) {
                    dest.gain.value = source.valueOf();
                }
            }
        });
    }

    private lookupNode(inst: string, id: string): AudioNode|Number {
        const instrument = this.instruments.get(inst);
        const node = instrument.oscillators.get(id) ||
                     instrument.gains.get(id) ||
                     instrument.numbers.get(id) ||
                     instrument.sources.get(id) ||
                     instrument.destinations.get(id);
        return node;
    }

    /**
     * Schedules oscillators to play for each note.
     */
    schedule(offset: number) {
        this.instruments.forEach(inst => {
            inst.notes.forEach(note => {
            });
        });
    }

    /**
     * Stops all oscillators from playing.
     */
    reset() {
        this.instruments.forEach(inst => {
            inst.oscillators.forEach(osc => {
                osc.stop(0);
            });
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

}