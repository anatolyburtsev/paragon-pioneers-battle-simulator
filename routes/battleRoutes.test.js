const app = require('../app');
const request = require('supertest');

describe("Test endpoints", () => {
    it("healthcheck", (done) => {
        request(app)
            .get("/battle/healthcheck")
            .expect(200, done);
    })

    it("single run endpoint smoke test", async () => {
        const response = await request(app)
            .post("/battle/singlerun")
            .send({
                "trialsCount": 5,
                "enemyArmy": [
                    {
                        "type": "OrcHunter",
                        "count": 10
                    }
                ],
                "playerArmy": [
                    {
                        "type": "Militia",
                        "count": 14
                    }
                ]
            });
        expect(response.status).toEqual(200);
        expect(response.body.winChance).toBeGreaterThan(50);
    });

    it("army optimize endpoint smoke test", async () => {
        const response = await request(app)
            .post("/battle/armyoptimizer")
            .send({
                "trialsCount": 5,
                "reduceFactor": 10,
                "playerArmyMaxSize": 100,
                "enemyArmy": [
                    {
                        "type": "OrcVeteran",
                        "count": 1
                    }
                ],
                "playerArmyStock": [
                    {
                        "type": "Footsoldier",
                        "count": 45
                    }
                ]
            });
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(2)
        expect(response.body[0].winChance).toBeGreaterThan(50)
    });
});
