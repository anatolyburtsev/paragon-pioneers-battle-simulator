const {calculateConfidenceInterval} = require("./tools");
const {AttackWave} = require("../gameLogic/troopConfig");
const {MAX_ARMY_SIZE} = require("../gameLogic/constants");
const {Army} = require("../gameLogic/army");
const {getArmyConfigCost} = require("../gameLogic");

class Simulation {
    constructor(simulationConfig) {
        this.simulationConfig = simulationConfig
        this.#validateConfig()
    }

    #validateConfig() {
        const troopsCount = this.simulationConfig.playerArmy
            .map(troopConfig => troopConfig.count)
            .reduce((a, b) => a + b, 0);
        if (troopsCount > MAX_ARMY_SIZE) {
            throw new Error(`Army size exceeds max limit: ${MAX_ARMY_SIZE}`)
        }
    }

    #initArmies() {
        this.playerArmy = new Army(this.simulationConfig.playerArmy)
        this.enemyArmy = new Army(this.simulationConfig.enemyArmy)
    }

    run() {
        const results = Array.apply(null, Array(this.simulationConfig.trialsCount))
            .map(() => this.#run_one_trial())
        const winChance = calculateConfidenceInterval(results.map(result => result.win ? 1 : 0),
            0, 1);
        //TODO: calculate other stats
        return {
            armyConfiguration: this.simulationConfig.playerArmy,
            armyCost: getArmyConfigCost(this.simulationConfig.playerArmy),
            winChance: Math.round(100 * winChance.mean)
        };
    }

    #run_one_trial() {
        this.#initArmies();
        const playerArmyCost = this.playerArmy.getCost()
        const playerArmySize = this.playerArmy.getTroopsCount();
        const enemyArmySize = this.enemyArmy.getTroopsCount();

        let numberOfRounds = 0
        while (!this.playerArmy.isEmpty() && !this.enemyArmy.isEmpty()) {
            for (const wave of [AttackWave.FirstWave, AttackWave.MiddleWave, AttackWave.LastWave]) {
                const playerHit = this.playerArmy.attack(this.enemyArmy, wave)
                const enemyHit = this.enemyArmy.attack(this.playerArmy, wave)
                const playerLoss = this.playerArmy.cleanDead()
                this.enemyArmy.cleanDead()
            }
            numberOfRounds += 1
        }

        return {
            win: this.enemyArmy.isEmpty(),
            costLoss: playerArmyCost - this.playerArmy.getCost(),
            playerArmySize,
            playerTroopsLoss: playerArmySize - this.playerArmy.getTroopsCount(),
            enemyTroopsLoss: enemyArmySize - this.enemyArmy.getTroopsCount(),
            numberOfRounds
        };
    }
}

module.exports = {
    Simulation
}