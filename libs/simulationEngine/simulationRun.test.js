const {SimulationRun} = require("./index");


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
        const simRun = new SimulationRun(testSetup);
        const result = simRun.run();
        const meanWinRate = result.winRate;
        expect(meanWinRate).toBeLessThan(100);
        expect(meanWinRate).toBeGreaterThan(0);
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
        const simRun = new SimulationRun(testSetup);
        const result = simRun.run();
        expect(result.winRate).toBeGreaterThanOrEqual(80)
    })
})