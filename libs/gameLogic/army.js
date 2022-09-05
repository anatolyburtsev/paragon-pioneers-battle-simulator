const {createUnit} = require("./troop");

class Army {
    troops = []

    constructor(army_config) {
        this.troops = army_config.map(
            troop_config => {
                const one_type_troops = []
                for (let i = 0; i < troop_config.count; i++) {
                    const troop = createUnit(troop_config.type)
                    one_type_troops.push(troop)
                }
                return one_type_troops
            }
        ).flat()
    }

    isEmpty() {
        for (const troop of this.troops) {
            if (troop.isAlive()) {
                return false
            }
        }
        return true
    }

    getCost() {
        return this.troops
            .filter(troop => troop.isAlive())
            .map(troop => troop.config.cost)
            .reduce((a, b) => a + b, 0)
    }

    getTroopsCount() {
        return this.troops.length;
    }

    /**
     *
     * @returns {number} number of dead troops
     */
    cleanDead() {
        const size_before_cleaning = this.troops.length
        this.troops = this.troops.filter(troop => troop.isAlive())
        const size_after_cleaning = this.troops.length
        return size_before_cleaning - size_after_cleaning
    }

    attack(enemy_army, attack_wave) {
        let total_hit_power = 0
        if (enemy_army.isEmpty()) {
            return
        }
        for (const troop of this.troops) {
            if (troop.attackOrder.includes(attack_wave)) {
                total_hit_power += troop.attack(enemy_army)
            }
        }
        return total_hit_power;
    }
}


const getArmyConfigCost = (armyConfig) => {
    return new Army(armyConfig).getCost();
}

const getArmyConfigTroopsCount = (armyConfig) => {
    return armyConfig.map(
        troopConfig => troopConfig.count
    ).reduce((a, b) => a + b, 0);
}

module.exports = {
    Army,
    getArmyConfigCost,
    getArmyConfigTroopsCount
}