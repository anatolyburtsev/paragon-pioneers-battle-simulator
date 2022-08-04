const {
    getStandardDeviation,
    calculateConfidenceInterval,
    isArrayHasDuplicates, range, cartesian
} = require("./tools");

describe("tools should work flawlessly", () => {
    it.each([
        ["shouldn't fail on empty array", []],
        ["should calculate std correct for single element array", [10]],
        ["should calculate std correct for array of the same elements", [42, 42, 42]],
    ])('%s', (description, inputArray) => {
        expect(getStandardDeviation(inputArray)).toEqual(0);
    })

    it("should calculate std correct", () => {
        expect(getStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toEqual(2)
    })

    it("should calculate confidence interval correct", () => {
        const array = [2, 4, 4, 4, 5, 5, 7, 9];
        const expectedMean = 5;
        const expectedStd = 2;
        const expectedInterval = 1.39;

        const confidenceInterval = calculateConfidenceInterval(array);

        expect(confidenceInterval.mean).toEqual(expectedMean);
        expect(confidenceInterval.std).toEqual(expectedStd);
        expect(confidenceInterval.interval.toFixed(2)).toEqual(expectedInterval.toFixed(2))

    })

    it.each([
        ["should calculate std correct for single element array", [42]],
        ["should calculate std correct for array of the same elements", [42, 42, 42]],
    ])('%s', (description, inputArray) => {
        expect(calculateConfidenceInterval(inputArray)).toEqual({
            mean: 42,
            std: 0,
            interval: 0
        });
    })

    it("should shouldn't fail on empty array", () => {
        expect(calculateConfidenceInterval([])).toEqual({})
    })

    it.each([
        [[1, 2], false],
        [[1], false],
        [[], false],
        [[1, 2, 1], true],
        [[1, 1, 1], true],
    ])('duplicate detection function should process array correct: %s, expect: %s', (array, expectedResult) => {
        const isArrayContainsDuplicates = isArrayHasDuplicates(array);
        expect(isArrayContainsDuplicates).toEqual(expectedResult)
    })

    it("should generate a range", () => {
        const array = range(1, 10, 2);
        const expectedArray = [1, 3, 5, 7, 9];
        expect(array).toEqual(expectedArray);
    })

    it("cartesian should work correct", () => {
        const cartesianProduct = cartesian([1, 2], ['a', 'b', 'c'])
        const expectedResult = [
            [1, 'a'],
            [1, 'b'],
            [1, 'c'],
            [2, 'a'],
            [2, 'b'],
            [2, 'c']
        ];
        expect(cartesianProduct).toEqual(expectedResult);
    })

})