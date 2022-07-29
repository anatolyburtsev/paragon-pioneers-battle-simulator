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

module.exports = {
    getStandardDeviation
}