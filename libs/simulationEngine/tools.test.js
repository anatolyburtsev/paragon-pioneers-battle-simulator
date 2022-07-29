const {getStandardDeviation} = require("./tools");
describe("tools should work flawlessly", () => {
    it("shouldn't fail on empty array", () => {
        expect(getStandardDeviation([])).toEqual(0)
    })

    it("should calculate std correct for single element array", () => {
        expect(getStandardDeviation([1])).toEqual(0)
    })

    it("should calculate std correct for array of the same elements", () => {
        expect(getStandardDeviation([42, 42, 42])).toEqual(0)
    })

    it("should calculate std correct", () => {
        expect(getStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toEqual(2)
    })
})