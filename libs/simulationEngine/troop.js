const {Features, AttackWave, TroopConfigs} = require("./troopConfig");


class Troop {
    constructor(config) {
        this.config = config;
        this.health = config.health;
        this.features = new Set(config.features);
        this.attackOrder = this.#detectAttackOrder();
    }

    #detectAttackOrder() {
        if (this.features.has(Features.DoubleStrike)) {
            return [AttackWave.FirstWave, AttackWave.LastWave];
        }
        if (this.features.has(Features.FirstStrike)) {
            return [AttackWave.FirstWave];
        }
        if (this.features.has(Features.LastStrike)) {
            return [AttackWave.LastWave];
        }

        return [AttackWave.MiddleWave]
    }

    consumeHit(hit_power) {
        const consumed_damage = Math.min(this.health, hit_power)
        this.health -= consumed_damage
        return consumed_damage
    }

    attack(enemy_army) {
        const hit_power = this.#generate_hit_power()

        if (this.features.has(Features.Trample)) {
            let remaining_hit_power = hit_power
            while (remaining_hit_power > 0) {
                const consumed_hit_power = this.#hit(hit_power, enemy_army)
                if (consumed_hit_power <= 0) {
                    break
                }
                remaining_hit_power -= consumed_hit_power
            }
        } else {
            this.#hit(hit_power, enemy_army)
        }
    }

    isAlive() {
        return this.health > 0
    }

    #hit(hit_power, enemy_army) {
        if (enemy_army.isEmpty()) {
            return 0
        }

        if (this.features.has(Features.Flanking)) {
            return Troop.#hit_weakest_alive(hit_power, enemy_army)
        } else {
            return Troop.#hit_first_alive(hit_power, enemy_army)
        }


    }

    static #hit_first_alive(hit_power, army) {
        for (const troop of army.troops) {
            if (troop.isAlive()) {
                return troop.consumeHit(hit_power)
            }
        }
        return 0
    }

    static #hit_weakest_alive(hit_power, army) {
        const alive_troops_health = army.troops.map(troop => troop.health).filter(health => health > 0)
        const min_alive_troops_health = Math.min(alive_troops_health)
        for (const troop of army.troops) {
            if (troop.health === min_alive_troops_health) {
                return troop.consumeHit(hit_power)
            }
        }
        return 0
    }

    #generate_hit_power() {
        if (Math.random() * 100 >= this.config.doubleStrikeChance) {
            return this.config.power * 2;
        } else {
            return this.config.power;
        }
    }
}

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
        if (enemy_army.isEmpty()) {
            return
        }
        for (const troop of this.troops) {
            if (troop.attackOrder.includes(attack_wave)) {
                troop.attack(enemy_army)
            }
        }
    }
}

const createUnit = (name) => {
    const config = TroopConfigs[name];
    if (!config) {
        throw new Error("troop " + name + " not found in config")
    }
    return new Troop(config);
}

module.exports = {
    Troop,
    Army,
    createUnit
}