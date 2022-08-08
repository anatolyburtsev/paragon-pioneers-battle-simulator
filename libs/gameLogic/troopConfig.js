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
    "Archer": new TroopConfig("Archer", 10, 20, 80, 8, [Features.Ranged]),
    "Footsoldier": new TroopConfig("Footsoldier", 40, 15, 80, 8, []),
    "Cavalry": new TroopConfig("Cavalry", 5, 5, 80, 16, [Features.Flanking, Features.FirstStrike]),
    "LongbowArcher": new TroopConfig("LongbowArcher", 10, 15, 80, 32, [Features.Ranged, Features.DoubleStrike]),
    "Knight": new TroopConfig("Knight", 90, 20, 80, 64, []),
    // clarify cost
    "Crossbowman": new TroopConfig("Crossbowman", 15, 90, 80, 64, [Features.Ranged]),
    // clarify cost
    "Cuirassier": new TroopConfig("Cuirassier", 120, 10, 80, 128, [Features.FirstStrike]),
    // clarify cost
    "Cannoneer": new TroopConfig("Cannoneer", 60, 80, 80, 128, [Features.Ranged,
        Features.Trample, Features.Flanking, Features.LastStrike]),

    "OrcHunter": new TroopConfig("OrcHunter", 10, 20, 60, -1, [Features.Ranged]),
    "OrcRaiders": new TroopConfig("OrcRaiders", 40, 15, 60, []),
    "OrcVeteran": new TroopConfig("OrcVeteran", 90, 20, 60, -1, []),
    "WargRider": new TroopConfig("WargRider", 5, 5, 60, -1, [Features.Flanking, Features.FirstStrike]),
    "EliteOrcHunters": new TroopConfig("EliteOrcHunters", 10, 15, 60, -1, [Features.Ranged, Features.DoubleStrike]),
    "OrcVanguard": new TroopConfig("OrcVanguard", 120, 10, 60, -1, [Features.FirstStrike]),
    "EliteOrcSniper": new TroopConfig("EliteOrcSniper", 15, 90, 60, [Features.Ranged]),
    "OrcDemolisher": new TroopConfig("OrcDemolisher", 60, 80, 60, -1, [Features.LastStrike, Features.Trample]),

    "BulaTheBully": new TroopConfig("BulaTheBully", 5000, 150, 50, -1, [Features.LastStrike, Features.Trample]),
    "AgukTheDestroyer": new TroopConfig("AgukTheDestroyer", 11000, 300, 50, -1, [Features.LastStrike, Features.Trample]),
    "MazogaTheIndestructible": new TroopConfig("MazogaTheIndestructible", 120000, 100, 50, -1, [Features.LastStrike, Features.Trample]),
    "DurgashTheDevastator": new TroopConfig("DurgashTheDevastator", 40000, 500, 50, -1, [Features.FirstStrike, Features.Trample])
}


module.exports = {
    Features,
    AttackWave,
    TroopConfigs
}