import NormalDistribution from "@/utils/NormalDistribution";

describe('NormalDistribution(normal) distribution', () => {
    it('should create an instance with standard normal distribution parameters', () => {
        const normalDistribution = new NormalDistribution();

        expect(normalDistribution.mean).toBe(0);
        expect(normalDistribution.std).toBe(1);
        expect(normalDistribution.pdf(0)).toBeCloseTo(0.3989)
    });

    it('should create an instance with specified distribution parameters', () => {
        const MEAN = 10.123;
        const STD = 2.23;

        const normalDistribution = new NormalDistribution(MEAN, STD);

        expect(normalDistribution.mean).toBe(MEAN);
        expect(normalDistribution.std).toBe(STD);
        expect(normalDistribution.pdf(0)).toBeCloseTo(0.000006)
    })
});
