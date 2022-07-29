const {SimulationRun} = require("./index");
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
            count: 10
        }
    ]
}


describe("test simulation run", () => {
    it("positive scenario", () => {
        const simRun = new SimulationRun(testSetup);
        const result = simRun.run();
        expect(result.winRate).toStrictEqual({
            mean: 0,
            lowerBound: 0,
            upperBound: 0
        })
    })
})