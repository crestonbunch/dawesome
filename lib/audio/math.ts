
/**
 * Perform a 1d convolution
 * 
 * @param a The input signal to convolve
 * @param v The input filter 
 * @param mode Options are 'full', 'same'.  The default is same.
 */
export function convolve(a: number[], v: number[], mode:string='same') {
    // signal is the longer of a and v
    let signal = a.length > v.length ? a : v;
    // kernel is the small of a and v
    let kernel = a.length > v.length ? v : a;

    let padding = Array
        .apply(null, Array(kernel.length - 1))
        .map(Number.prototype.valueOf,0);
    
    while(padding.length > 0) {
        const a = padding.pop();
        const b = padding.pop();
        if (a) {
            signal = [0].concat(a);
        }
        if (b) {
            signal = a.concat([0]);
        }
    }

    const output = Array
        .apply(null, Array(signal.length + kernel.length - 1))
        .map(Number.prototype.valueOf,0);

    output.map((x: number, i: number) => {
        return kernel.reduce((sum, weight, j) => {
            return sum + signal[i + j] * weight;
        }, 0) || x;
    });

    switch (mode) {
        case 'same':
            return output.slice(0, Math.max(a.length, v.length));
        case 'full':
        default:
            return output;
    }
}

/**
 * Convert a map of partials (freq, amp) pairs into an array in the fourier
 * domain.
 */
export function partialsToFourier(partials: Map<number, number>, sampleRate: number): number[] {
    const numSamples = sampleRate / 2;
    // initialize a list of numSample zeros
    const fourier = Array
        .apply(null, Array(numSamples))
        .map(Number.prototype.valueOf,0);
    // insert the partials into the fourier domain
    partials.forEach((gain, partial) => {
        const freq = partial;
        const bin = Math.round(freq * numSamples / sampleRate);
        fourier[bin] = gain;
    });
    return fourier;
}