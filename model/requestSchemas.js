const Joi = require('joi');


const armySchema = Joi.array().items(
    Joi.object({
        type: Joi.string().required(),
        count: Joi.number().min(1).max(150).required()
    }).required());

const singleRunRequestSchema = Joi.object({
    trialsCount: Joi.number().min(1).max(100).required(),
    enemyArmy: armySchema.required(),
    playerArmy: armySchema.required()
})

const optimizerRunRequestSchema = Joi.object({
    trialsCount: Joi.number().min(1).max(100).default(30).required(),
    reduceFactor: Joi.number().min(1).max(25).default(10).required(),
    maxPlayerArmySize: Joi.number().min(50).max(150).default(100).required(),
    enemyArmy: armySchema.required(),
    playerArmyStock: armySchema.required()
})

module.exports = {
    singleRunRequestSchema,
    optimizerRunRequestSchema
}