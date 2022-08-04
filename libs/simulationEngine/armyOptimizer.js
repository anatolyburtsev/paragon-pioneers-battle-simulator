const {MAX_ARMY_SIZE} = require("./constants");
const {isArrayHasDuplicates, range, cartesian} = require("./tools");
const {SimulationRun} = require("./index");


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
            const simulationRun = new SimulationRun(fullSimulationConfig);
            return simulationRun.run();
        })
        // TODO apply optimization rules here
        return results;
    }

    generateSimulationConfigs() {
        const rawGeneratedConfigs = this.#generateSimulationConfigsRecursive(this.playerArmyStock);
        // TODO: add hard limit on number of generated configuration if necessary
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

        return cartesian(oneDimensionConfigs, reducedArmyStockConfigs)
    }

    #generateSingleDimensionSimulationConfigs(troopConfig) {
        const numberOfConfigurations = Math.floor(troopConfig.count / this.reduceFactor);
        return range(0, numberOfConfigurations).map(idx => ({
            type: troopConfig.type,
            count: idx * this.reduceFactor
        }))
    }


}

module.exports = {
    ArmyOptimizer
}