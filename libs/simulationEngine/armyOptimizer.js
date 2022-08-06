const {isArrayHasDuplicates, range, cartesian, pickRandomItem} = require("./tools");
const {Simulation} = require("./simulation");
const {MAX_ARMY_SIZE, MAX_SIMULATIONS_COUNT} = require("../gameLogic/constants");
const {getArmyConfigTroopsCount} = require("../gameLogic");

class ArmyOptimizer {
    constructor(optimizerConfig) {
        this.trialsCount = optimizerConfig.trialsCount;
        this.reduceFactor = optimizerConfig.reduceFactor;
        this.enemyArmy = optimizerConfig.enemyArmy;
        this.playerArmyMaxSize = optimizerConfig.playerArmyMaxSize;
        this.playerArmyStock = optimizerConfig.playerArmyStock;

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

        const bestResultsWithHighestWinChance = this.#findResultHighestWinChance(results)
        return [
            ...bestResultsWithHighestWinChance
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

    #findResultHighestWinChance(results) {
        const maxWinChance = Math.max(...results.map(result => result.winRate));
        const resultsWithMaxWinChance = results.filter(result => result.winRate === maxWinChance);
        const smallestArmySize = Math.min(...resultsWithMaxWinChance
            .map(result => getArmyConfigTroopsCount(result.armyConfiguration)))
        const resultsWithSmallestArmySize = resultsWithMaxWinChance
            .filter(result => getArmyConfigTroopsCount(result.armyConfiguration) === smallestArmySize);
        return [
            {
                "name": "maxWinChanceRandomSetup",
                "winChance": maxWinChance,
                "army": pickRandomItem(resultsWithMaxWinChance).armyConfiguration
            },
            {
                "name": "maxWinChanceSmallestArmy",
                "winChance": maxWinChance,
                "army": pickRandomItem(resultsWithSmallestArmySize).armyConfiguration
            },
        ];
    }
}

module.exports = {
    ArmyOptimizer
}