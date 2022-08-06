const {Army} = require("./army");

describe("test army logic", () => {
    let army;

    beforeEach(() => {
        const army_config = [
            {
                type: "OrcHunter",
                count: 10
            }
        ]
        army = new Army(army_config)
    })

    it("should create army and basic methods should work", () => {
        expect(army.isEmpty()).toBeFalsy()
        expect(army.troops).toHaveLength(10)
        expect(army.cleanDead()).toEqual(0)

        army.troops[0].consumeHit(100)
        expect(army.cleanDead()).toEqual(1)
    })

    it("army cost should calculated properly", () => {
        const playerArmy = new Army([
            {
                type: "Militia",
                count: 2
            }
        ]);
        expect(playerArmy.getCost()).toEqual(2);
    })

    it("should count troops correctly", () => {
        const playerArmy = new Army([
            {
                type: "Militia",
                count: 2
            }, {
                type: "Footsoldier",
                count: 3
            }
        ]);
        expect(playerArmy.getTroopsCount()).toEqual(5);
    })

})