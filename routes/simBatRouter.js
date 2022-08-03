var express = require('express');
const {simBatRequestSchema} = require("../model/requestSchemas");
const {SimulationRun} = require("../libs/simulationEngine");
var router = express.Router();

// schema options
const requestValidationOptions = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

router.post('/singlerun', function (req, res, next) {
    const {error, value} = simBatRequestSchema.validate(req.body, requestValidationOptions);
    if (error) {
        res.sendStatus(400)
        return
        // throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    const simRun = new SimulationRun(value);
    const result = simRun.run()
    res.json(result);
});

module.exports = router;
