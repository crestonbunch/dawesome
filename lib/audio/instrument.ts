import { partialsToFourier } from "lib/audio/math";
import { Note } from "lib/audio/interfaces";
import { InstrumentState } from "components/instrument/state";
import { GraphState, EdgeState } from "components/graph/state";

/**
 * An instrument manages a collection of AudioNodes, and provides a simple
 * interface for updating nodes in the audio graph using the redux application 
 * store.
 */
export class Instrument {

    private context: AudioContext;
    private notes: Note[];
    private oscillators: Map<string, OscillatorNode[]>;
    private gains: Map<string, GainNode[]>;
    private numbers: Map<string, Number>;
    private sources: Map<string, Number[]>;
    private destinations: Map<string, AudioDestinationNode>;

    constructor(context: AudioContext, notes: Note[]) {
        this.context = context;
        this.notes = notes;
        this.oscillators = new Map<string, OscillatorNode[]>();
        this.gains = new Map<string, GainNode[]>();
        this.numbers = new Map<string, Number>();
        this.sources = new Map<string, Number[]>();
        this.destinations = new Map<string, AudioDestinationNode>();
    }

    build(state: InstrumentState, edges: Map<string, EdgeState>) {
        this.buildOscillators(state.oscillators);
        this.buildGains(state.gains);
        this.buildNumbers(state.numbers);
        this.buildSources(state.input);
        this.buildDestinations(state.output);
        this.buildEdges(edges);
    }

    /**
     * Adds the given oscillators to the instrument with the given
     * partials. Creates oscillator nodes for every note the instrument must
     * play. If a node already exists for a note, then the existing node is
     * updated instead of a new one being created.
     * 
     * @param state 
     */
    buildOscillators(state: Map<string, Map<number, number>>) {
        state.forEach((partials: Map<number, number>, id: string) => {
            this.oscillators.set(id, new Array<OscillatorNode>());
            this.notes.forEach((note: Note, i: number) => {
                this.oscillators.get(id).push(this.context.createOscillator());
                const node = this.oscillators.get(id)[i];
                const real = partialsToFourier(new Map<number, number>(), this.context.sampleRate);
                const imag = partialsToFourier(partials, this.context.sampleRate);
                const wave = this.context.createPeriodicWave(real, imag);
                node.setPeriodicWave(wave);
            });
        });
    }

    /**
     * Adds the given gain nodes to the instrument. Builds one for each note
     * the instrument must play, or updates an already existing one.
     * 
     * @param state 
     */
    buildGains(state: Map<string, number>) {
        state.forEach((val, id) => {
            if (!this.gains.has(id)) {
                const arr = new Array<GainNode>();
                this.gains.set(id, arr);
            }
            this.notes.forEach((note, i) => {
                while (this.gains.get(id).length <= i) {
                    this.gains.get(id).push(this.context.createGain());
                }
                const node = this.gains.get(id)[i];
                node.gain.value = val;
            });
        });
    }

    /**
     * Adds the given numbers (constants) to the instrument.
     * 
     * @param state 
     */
    buildNumbers(state: Map<string, number>) {
        state.forEach((val, id) => {
            this.numbers.set(id, val);
        });
    }

    buildSources(state: string) {
        const arr = new Array<Number>();
        this.notes.forEach((note, i) => {
            arr.push(note.freq);
        });
        this.sources.set(state, arr);
    }

    buildDestinations(state: string) {
        this.destinations.set(state, this.context.destination);
    }
    /**
     * Connects the nodes in the instrument to the appropriate spots given the
     * edges from a graph.
     * 
     * @param edges 
     */
    buildEdges(edges: Map<string, EdgeState>) {
        edges.forEach((edge, id) => {
            this.notes.forEach((note, i) => {
                const source = this.lookupNode(edge.from, i);
                const dest = this.lookupNode(edge.to, i);
                if (source instanceof AudioNode) {
                    // clear existing connections
                    source.disconnect();
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
        });
    }

    private lookupNode(id: string, index: number): AudioNode|Number {
        if (this.oscillators.has(id)) {
            return this.oscillators.get(id)[index];
        } else if (this.gains.has(id)) {
            return this.gains.get(id)[index];
        } else if (this.numbers.has(id)) {
            return this.numbers.get(id);
        } else if (this.sources.get(id)) {
            return this.sources.get(id)[index];
        } else if (this.destinations.get(id)) {
            return this.destinations.get(id);
        }
    }

    /**
     * Schedule each oscillator to play.
     * 
     * @param offset
     */
    schedule(offset: number) {
        this.notes.forEach((note, i) => {
            const start = Math.max(note.start - offset, 0);
            const stop = Math.max(note.end - offset, 0);
            this.oscillators.forEach((osc, key) => {
                osc[i].start(start); // reschedule playback
                osc[i].stop(stop);
            });
        });
    }

    reset() {
        this.notes.forEach((note, i) => {
            this.oscillators.forEach((osc, key) => {
                osc[i].stop(0);
            });
        });
    }
}