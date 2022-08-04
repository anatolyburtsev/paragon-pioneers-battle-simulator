const {ArmyOptimizer} = require("./armyOptimizer");


describe("army optimizer logic test", () => {
    it("config generator should work correct", () => {
        const config = {
            trialsCount: 30,
            reduceFactor: 20,
            playerArmyMaxSize: 60,
            enemyArmy: [
                {
                    type: "OrcHunter",
                    count: 10
                }
            ],
            playerArmyStock: [
                {
                    type: "Militia",
                    count: 100
                },
                {
                    type: "Footsoldier",
                    count: 30
                },
            ]
        }

        const armyOptimizer = new ArmyOptimizer(config);
        const generatedSimulationConfigs = armyOptimizer.generateSimulationConfigs(this.playerArmyStock);

        const expectedConfigurations = [
            [{type: 'Militia', count: 0}, {type: 'Footsoldier', count: 20}],
            [{type: 'Militia', count: 20}, {type: 'Footsoldier', count: 0}],
            [{type: 'Militia', count: 20}, {type: 'Footsoldier', count: 20}],
            [{type: 'Militia', count: 40}, {type: 'Footsoldier', count: 0}],
            [{type: 'Militia', count: 40}, {type: 'Footsoldier', count: 20}],
            [{type: 'Militia', count: 60}, {type: 'Footsoldier', count: 0}]
        ]
        expect(generatedSimulationConfigs).toStrictEqual(expectedConfigurations);
    })

    it("should provide correct optimization results", () => {
        const config = {
            trialsCount: 30,
            reduceFactor: 20,
            playerArmyMaxSize: 60,
            enemyArmy: [
                {
                    type: "OrcHunter",
                    count: 40
                }
            ],
            playerArmyStock: [
                {
                    type: "Militia",
                    count: 100
                },
                {
                    type: "Footsoldier",
                    count: 30
                },
            ]
        }

        const armyOptimizer = new ArmyOptimizer(config);
        console.dir(armyOptimizer.run())
    })

})