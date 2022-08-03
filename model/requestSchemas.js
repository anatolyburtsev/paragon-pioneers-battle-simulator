const Joi = require('joi');


const armySchema = Joi.array().items(
    Joi.object({
        type: Joi.string().required(),
        count: Joi.number().required()
    }).required());

const simBatRequestSchema = Joi.object({
    trialsCount: Joi.number().min(1).max(100).required(),
    enemyArmy: armySchema.required(),
    playerArmy: armySchema.required()
})

module.exports = {
    simBatRequestSchema
}