const {ArmyOptimizer} = require("./armyOptimizer");


describe("army optimizer logic test", () => {
    it("should not fail", () => {
        const config = {
            trialsCount: 30,
            reduceFactor: 20,
            enemyArmy: [
                {
                    type: "OrcHunter",
                    count: 10
                }
            ],
            playerArmy: [
                {
                    type: "Militia",
                    count: 13
                }
            ]
        }

        const armyOptimizer = new ArmyOptimizer(config);
    })

})