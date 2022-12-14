var express = require('express');
const {singleRunRequestSchema, optimizerRunRequestSchema} = require("../model/requestSchemas");
const {Simulation, ArmyOptimizer} = require("../libs/simulationEngine");
var router = express.Router();

// schema options
const requestValidationOptions = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

router.post('/singlerun', function (req, res, next) {
    const {error, value} = singleRunRequestSchema.validate(req.body, requestValidationOptions);
    if (error) {
        res.sendStatus(400)
        return
    }
    const simRun = new Simulation(value);
    const result = simRun.run()
    res.json(result);
});

router.post('/armyoptimizer', function (req, res, next) {
    const {error, value} = optimizerRunRequestSchema.validate(req.body, requestValidationOptions);
    if (error) {
        res.sendStatus(400)
        return
    }
    const armyOptimizer = new ArmyOptimizer(value);
    const result = armyOptimizer.run()
    res.json(result);
});

router.get("/healthcheck", function(req, res, nesxt) {
    res.json({"status": "ok"}).status(200);
})


module.exports = router;
