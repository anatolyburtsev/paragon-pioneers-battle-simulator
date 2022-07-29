const Features = {
    Flanking: "Flanking", // attack the weakest opponents first
    Ranged: "Ranged", // No functional meaning, all defined by order
    Trample: "Trample", // can assign damage to more than one unit
    FirstStrike: "FirstStrike", // attacks before anyone else
    LastStrike: "LastStrike", // attacks after everyone else
    DoubleStrike: "DoubleStrike" //attacks one time before anyone else, second time after everyone else
}

const AttackWave = {
    FirstWave: "FirstWave",
    MiddleWave: "MiddleWave",
    LastWave: "LastWave"
}

class TroopConfig {
    constructor(name, health, power, doubleStrikeChance, cost, features) {
        this.name = name;
        this.health = health;
        this.power = power;
        this.doubleStrikeChance = doubleStrikeChance;
        this.cost = cost;
        this.features = features;
    }
}


const TroopConfigs = {
    "Militia": new TroopConfig("Militia", 15, 5, 80, 1, []),
    "OrcHunter": new TroopConfig("OrcHunter", 10, 20, 60, -1, [Features.Ranged])
}


module.exports = {
    Features,
    AttackWave,
    TroopConfigs
}