const {getStandardDeviation, calculateConfidenceInterval} = require("./tools");
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
        const expectedInterval = {
            mean: 5,
            lowerBound: 1,
            upperBound: 9
        }

        expect(calculateConfidenceInterval(array)).toStrictEqual(expectedInterval)
    })

    it.each([
        ["should calculate std correct for single element array", [42]],
        ["should calculate std correct for array of the same elements", [42, 42, 42]],
    ])('%s', (description, inputArray) => {
        expect(calculateConfidenceInterval(inputArray)).toEqual({
            mean: 42,
            lowerBound: 42,
            upperBound: 42
        });
    })

    it("should shouldn't fail on empty array", () => {
        expect(calculateConfidenceInterval([])).toEqual({})
    })
})