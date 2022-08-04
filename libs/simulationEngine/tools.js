const getStandardDeviation = (array) => {
    if (!array || array.length === 0) {
        return 0;
    }
    const n = array.length;
    const mean = array.reduce((a, b) => a + b, 0) / n
    return Math.sqrt(
        array.map(x => Math.pow(x - mean, 2))
            .reduce((a, b) => a + b, 0) / n
    )
}

const T_VALUE_95_CONF = 1.96

const calculateConfidenceInterval = (array, lowerBoundCut = null, upperBoundCut = null) => {
    if (!array || array.length === 0) {
        return {}
    }
    const mean = array.reduce((a, b) => a + b, 0) / array.length
    const std = getStandardDeviation(array)
    const interval = T_VALUE_95_CONF * std / Math.sqrt(array.length)

    return {
        mean,
        std,
        interval,
    }
}

const isArrayHasDuplicates = (arr) => {
    return new Set(arr).size !== arr.length
}

const range = (start, stop, step = 1) => Array.from(
    {length: (stop - start) / step + 1},
    (_, i) => start + (i * step));

const cartesian = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));

module.exports = {
    getStandardDeviation,
    calculateConfidenceInterval,
    isArrayHasDuplicates,
    range,
    cartesian
}