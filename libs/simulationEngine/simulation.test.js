const {Simulation} = require("./index");


describe("test simulation run", () => {
    it("positive scenario, player has chance to win", () => {
        const testSetup = {
            trialsCount: 30,
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
        const simRun = new Simulation(testSetup);
        const result = simRun.run();
        const meanWinChance = result.winChance;
        expect(meanWinChance).toBeLessThan(100);
        expect(meanWinChance).toBeGreaterThan(0);

        expect(result.armyConfiguration).toEqual(testSetup.playerArmy);
        expect(result.armyCost).toEqual(13);
    })


    it("positive scenario, player has big chance to win", () => {
        const testSetup = {
            id: "abcd-efght-asdfj-asdf",
            trialsCount: 30,
            enemyArmy: [
                {
                    type: "OrcHunter",
                    count: 10
                }
            ],
            playerArmy: [
                {
                    type: "Militia",
                    count: 14
                }
            ]
        }
        const simRun = new Simulation(testSetup);
        const result = simRun.run();
        expect(result.winChance).toBeGreaterThanOrEqual(70)
    })
})