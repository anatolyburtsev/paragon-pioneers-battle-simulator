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


module.exports = {
    getStandardDeviation,
    calculateConfidenceInterval
}