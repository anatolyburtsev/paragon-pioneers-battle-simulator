const {Army} = require("./troop");
const {AttackWave} = require("./troopConfig");
const {getStandardDeviation, calculateConfidenceInterval} = require("./tools");


class SimulationRun {
    constructor(simulationRunConfig) {
        this.runConfig = simulationRunConfig
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