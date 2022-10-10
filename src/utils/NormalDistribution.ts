/**
 * Represents normal distribution
 */
export default class NormalDistribution {
    /**
     * The constructor, assumes a standardized normal distribution if
     * there are no parameters given
     * @param {number} [mean=0] - the mean average
     * @param {number} [std=1] - the standard deviation
     */
    constructor(
        readonly mean = 0,
        readonly std = 1
    ) {
    }

    /**
     * Return the probability of finding x in the distribution
     * @param {number} value - the value to evaluate
     * @return {number} the probability
     */
    pdf(value: number): number {
        const dividend =
            Math.E ** -((value - this.mean) ** 2 / (2 * this.std ** 2));
        const divisor = this.std * Math.sqrt(2 * Math.PI);

        return dividend / divisor;
    }
}
