const {Army} = require("./troop");
const {AttackWave} = require("./troopConfig");
const {calculateConfidenceInterval} = require("./tools");
const {MAX_ARMY_SIZE} = require("./constants");

class SimulationRun {
    constructor(simulationRunConfig) {
        this.runConfig = simulationRunConfig
        this.#validateConfig()
    }

    #validateConfig() {
        const troopsCount = this.runConfig.playerArmy
            .map(troopConfig => troopConfig.count)
            .reduce((a, b) => a + b, 0);
        if (troopsCount > MAX_ARMY_SIZE) {
            throw new Error(`Army size exceeds max limit: ${MAX_ARMY_SIZE}`)
        }
    }

    #initArmies() {
        this.playerArmy = new Army(this.runConfig.playerArmy)
        this.enemyArmy = new Army(this.runConfig.enemyArmy)
    }

    run() {
        const results = Array.apply(null, Array(this.runConfig.trialsCount))
            .map(() => this.run_one_trial())
        const winRate = calculateConfidenceInterval(results.map(result => result.win ? 1 : 0),
            0, 1);
        //TODO: calculate other stats
        return {
            winRate
        };
    }

    run_one_trial() {
        this.#initArmies();
        const playerArmyCost = this.playerArmy.getCost()
        const playerArmySize = this.playerArmy.troops.length;
        const enemyArmySize = this.enemyArmy.troops.length;

        let numberOfRounds = 0
        while (!this.playerArmy.isEmpty() && !this.enemyArmy.isEmpty()) {
            for (const wave of [AttackWave.FirstWave, AttackWave.MiddleWave, AttackWave.LastWave]) {
                this.playerArmy.attack(this.enemyArmy, wave)
                this.enemyArmy.attack(this.playerArmy, wave)
                this.playerArmy.cleanDead()
                this.enemyArmy.cleanDead()
            }
            numberOfRounds += 1
        }

        return {
            win: this.enemyArmy.isEmpty(),
            costLoss: playerArmyCost - this.playerArmy.getCost(),
            playerArmySize,
            playerTroopsLoss: playerArmySize - this.playerArmy.troops.length,
            enemyTroopsLoss: enemyArmySize - this.enemyArmy.troops.length,
            numberOfRounds
        };
    }
}

module.exports = {
    SimulationRun
}