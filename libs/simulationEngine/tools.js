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

const calculateConfidenceInterval = (array, lowerBoundCut = null, upperBoundCut = null) => {
    if (!array || array.length === 0) {
        return {}
    }
    const mean = array.reduce((a, b) => a + b, 0) / array.length
    const std = getStandardDeviation(array)
    const lowerBoundReal = mean - 2 * std;
    const lowerBound = lowerBoundCut !== null ? Math.max(lowerBoundCut, lowerBoundReal) : lowerBoundReal;
    const upperBoundReal = mean + 2 * std;
    const upperBound = upperBoundCut !== null ? Math.min(upperBoundCut, upperBoundReal) : upperBoundReal;

    return {
        mean,
        lowerBound,
        upperBound,
    }
}


module.exports = {
    getStandardDeviation,
    calculateConfidenceInterval
}