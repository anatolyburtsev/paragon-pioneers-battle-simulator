const {Army, createUnit} = require("./troop");


describe("test troop logic", () => {
    let troop;

    beforeEach(() => {
        troop = createUnit("Militia")
    })

    it("simple troop creation", () => {
        expect(troop.health).toEqual(15);
        expect(troop.config.power).toEqual(5);
        expect(troop.config.name).toEqual("Militia");
        expect(troop.features).toEqual(new Set());
        expect(troop.attackOrder).toEqual(["MiddleWave"]);
        expect(troop.isAlive()).toBeTruthy()
    })

    it("troop should consume damage", () => {
        const health_before_hit = troop.health
        const hit_power = 3
        const consumed_hit = troop.consumeHit(hit_power)
        const health_after_hit = troop.health
        expect(health_before_hit - health_after_hit).toEqual(hit_power)
        expect(consumed_hit).toEqual(hit_power)
    })

    it("troop can't consume more damage then it's health", () => {
        const hit_power = troop.health * 5
        const troop_health = troop.health
        const consumed_hit = troop.consumeHit(hit_power)
        expect(consumed_hit).toEqual(troop_health)
    })
})

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
})
