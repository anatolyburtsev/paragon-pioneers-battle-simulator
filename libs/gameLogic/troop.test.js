const {createUnit} = require("./troop");


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
