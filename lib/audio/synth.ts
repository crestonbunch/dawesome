import { convolve, partialsToFourier } from "lib/audio/math";
import { Note } from "lib/audio/interfaces";

export namespace Synth {

    /**
     * A synth class that can attach itself to an audio context and play
     * notes.
     */
    export class Synth {

        public readonly out: AudioNode;
        private context: AudioContext;
        private oscillators: Oscillator[] = [];

        constructor(context: AudioContext) {
            this.context = context;
            this.out = context.createGain();
        }

        public attach(osc: Oscillator) {
            this.oscillators.push(osc);
            osc.out.connect(this.out);
        }

        public schedule(note: Note, offset: number) {
            this.oscillators.forEach(osc => {
                osc.schedule(note, offset);
            });
        }

        public free() {
            this.oscillators.forEach(osc => {
                osc.free();
            });
        }
    }

    export class Oscillator {

        public readonly out: GainNode;
        protected context: AudioContext;
        protected nodes: AudioNode[] = [];

        // Partials (multiples of the root frequency) and their relative
        // amplitudes.
        public partials: Map<number, number>;

        constructor(context: AudioContext, partials = new Map<number, number>()) {
            this.context = context;
            this.out = context.createGain();
            this.partials = partials;
        }

        build(): OscillatorNode {
            const node = this.context.createOscillator();
            const freq = this.frequencies;
            if (freq.length > 0) {
                const real = new Float32Array(freq);
                const imag = new Float32Array(freq.length);
                const wave = this.context.createPeriodicWave(real, imag);
                node.setPeriodicWave(wave);
            }
            this.nodes.push(node);
            node.connect(this.out);
            return node;
        }

        schedule(note: Note, offset: number) {
            const node = this.build();
            node.start(Math.max(note.start - offset, 0));
            //node.stop(Math.max(note.end - offset, 0));
        }

        free() {
            this.nodes.forEach((node) => {
                node.disconnect();
            });
            this.nodes = [];
        }

        set gain(val: number) {
            this.out.gain.value = val;
        }

        get sampleRate(): number {
            return this.context.sampleRate;
        }

        /**
         * Returns the frequency-domain representation of this oscillator
         * with respect to the audio context sample rate (to prevent aliasing.)
         */
        get frequencies(): number[] {
            return partialsToFourier(this.partials, this.sampleRate);
        }
    }

    /**
     * A RingModulator multiplies the carrier signal by many response signals,
     * weighted by coefficients.
     */
    export class RingModulator extends Oscillator {
        public weights: number[] = [];
        public signals: Map<number, number>[] = new Array<Map<number, number>>();

        /**
         * Overwrite the build method to create an oscillator that is 
         * ring-modulated by the input signals.
         */
        build(): OscillatorNode {
            const carrier = this.context.createOscillator();

            const out = this.signals.reduce((accum: AudioNode, signal, i) => {
                if (this.weights[i] === 0) { return accum; }
                // create a new oscillator
                const mod = new Oscillator(this.context, signal);
                const node = mod.build();
                const mag = mod.out;
                mag.gain.value = this.weights[i];
                node.start();

                // this oscillator becomes the input signal for a gain node
                const gain = this.context.createGain();
                mag.connect(gain.gain);

                // the current node in the chain gets connected to this gain
                accum.connect(gain);

                this.nodes.push(node);
                this.nodes.push(mag);
                this.nodes.push(gain);

                return gain;
            }, carrier);

            out.connect(this.out);

            const freq = this.frequencies;
            if (freq.length > 0) {
                const real = new Float32Array(freq);
                const imag = new Float32Array(freq.length);
                const wave = this.context.createPeriodicWave(real, imag);
                carrier.setPeriodicWave(wave);
            }
            this.nodes.push(carrier);
            return carrier;
        }
    }
}
