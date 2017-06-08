/**
 * Convert a map of partials (freq, amp) pairs into an array in the fourier
 * domain.
 */
export function partialsToFourier(partials: Map<number, number>, sampleRate: number): Float32Array {
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
    return new Float32Array(fourier);
}