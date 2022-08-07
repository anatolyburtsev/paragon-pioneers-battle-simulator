const {isArrayHasDuplicates, range, cartesian, pickRandomItem} = require("./tools");
const {Simulation} = require("./simulation");
const {MAX_ARMY_SIZE, MAX_SIMULATIONS_COUNT} = require("../gameLogic/constants");
const {getArmyConfigTroopsCount, getArmyConfigCost} = require("../gameLogic");

class ArmyOptimizer {
    constructor(optimizerConfig) {
        this.trialsCount = optimizerConfig.trialsCount;
        this.reduceFactor = optimizerConfig.reduceFactor;
        this.enemyArmy = optimizerConfig.enemyArmy;
        this.playerArmyMaxSize = optimizerConfig.playerArmyMaxSize;
        this.playerArmyStock = optimizerConfig.playerArmyStock;
        this.minAcceptableWinChance = optimizerConfig.minAcceptableWinChance;

        this.#validateConfig()
    }

    #validateConfig() {
        if (this.playerArmyMaxSize > MAX_ARMY_SIZE) {
            throw new Error(`Player army max size can't exceed ${MAX_ARMY_SIZE}. Got: ${this.playerArmyMaxSize}`);
        }
        if (isArrayHasDuplicates(this.enemyArmy.map(troopConfig => troopConfig.type))) {
            throw new Error(`Enemy army can't have duplicated troops. Received: ${this.enemyArmy}`);
        }
        if (isArrayHasDuplicates(this.playerArmyStock.map(troopConfig => troopConfig.type))) {
            throw new Error(`Player army stock can't have duplicated troops. Received: ${this.enemyArmy}`);
        }
    }

    run() {
        const simulationConfigs = this.generateSimulationConfigs();
        const results = simulationConfigs.map(simulationConfig => {
            const fullSimulationConfig = {
                playerArmy: simulationConfig,
                trialsCount: this.trialsCount,
                enemyArmy: this.enemyArmy
            }
            const simulationRun = new Simulation(fullSimulationConfig);
            return simulationRun.run();
        })

        const maxWinChance = Math.max(...results.map(result => result.winChance));
        const bestResultsWithHighestWinChance = this.#findResultHighestWinChance(results,
            maxWinChance,
            "maxWinChance")
        const bestResultsAcceptableWinChance = this.#findResultHighestWinChance(results,
            this.minAcceptableWinChance, "minAcceptableWinChance")
        return [
            ...bestResultsWithHighestWinChance,
            ...bestResultsAcceptableWinChance
        ];
    }

    generateSimulationConfigs() {
        const rawGeneratedConfigs = this.#generateSimulationConfigsRecursive(this.playerArmyStock);
        return rawGeneratedConfigs.filter(simulationConfig => {
            const troopsCount = simulationConfig
                .map(troopConfig => troopConfig.count)
                .reduce((a, b) => a + b, 0);
            return troopsCount > 0 && troopsCount <= this.playerArmyMaxSize;
        })
    }

    #generateSimulationConfigsRecursive(armyStock) {
        const oneDimensionConfigs = this.#generateSingleDimensionSimulationConfigs(armyStock[0]);
        if (armyStock.length === 1) {
            return oneDimensionConfigs;
        }
        const reducedArmyStock = armyStock.slice(1);
        const reducedArmyStockConfigs = this.#generateSimulationConfigsRecursive(reducedArmyStock);
        if (reducedArmyStockConfigs.length * oneDimensionConfigs.length > MAX_SIMULATIONS_COUNT) {
            throw new Error(`Number of simulations exceeds the threshold: ${MAX_SIMULATIONS_COUNT}`);
        }

        return cartesian(oneDimensionConfigs, reducedArmyStockConfigs)
    }

    #generateSingleDimensionSimulationConfigs(troopConfig) {
        const numberOfConfigurations = Math.floor(troopConfig.count / this.reduceFactor);
        return range(0, numberOfConfigurations).map(idx => ([{
            type: troopConfig.type,
            count: idx * this.reduceFactor
        }]))
    }

    #findResultHighestWinChance(results, minAcceptableWinChance, prefix) {
        const acceptableResults = results
            .filter(result => result.winChance >= minAcceptableWinChance);
        const randomAcceptableResult = pickRandomItem(acceptableResults);
        const randomAcceptableResponse = !randomAcceptableResult ? {} :
            {
                "name": `${prefix}RandomSetup`,
                "winChance": randomAcceptableResult.winChance,
                "army": randomAcceptableResult.armyConfiguration
            };

        const smallestArmySize = Math.min(...acceptableResults
            .map(result => getArmyConfigTroopsCount(result.armyConfiguration)))
        const resultsWithSmallestArmySize = acceptableResults
            .filter(result => getArmyConfigTroopsCount(result.armyConfiguration) === smallestArmySize);
        const randomSmallestArmyResult = pickRandomItem(resultsWithSmallestArmySize);
        const smallestArmyResponse = !randomSmallestArmyResult ? {} :
            {
                "name": `${prefix}SmallestArmy`,
                "winChance": randomSmallestArmyResult.winChance,
                "army": randomSmallestArmyResult.armyConfiguration
            };

        const cheapestArmyCost = Math.min(...acceptableResults
            .map(result => result.armyCost));
        const resultsWithCheapestCost = acceptableResults
            .filter(result => result.armyCost === cheapestArmyCost);
        const randomCheapestArmyResult = pickRandomItem(resultsWithCheapestCost);
        const cheapestArmyResponse = !randomCheapestArmyResult ? {} : {
            "name": `${prefix}CheapestArmy`,
            "winChance": randomCheapestArmyResult.winChance,
            "army": randomCheapestArmyResult.armyConfiguration
        };

        return [
            randomAcceptableResponse,
            smallestArmyResponse,
            cheapestArmyResponse
        ];
    }
}

module.exports = {
    ArmyOptimizer
}