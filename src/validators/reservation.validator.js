const Joi = require('joi');

exports.createReservationSchema = Joi.object({
    id_mountain: Joi.number().required(),
    start_date: Joi.date().required(),
    name: Joi.string().max(255).required(),
    nik: Joi.string().max(255).required(),
    gender: Joi.string().valid('male', 'female').required(),
    phone_number: Joi.string().max(255).required(),
    address: Joi.string().required(),
    citizen: Joi.string().max(255).required(),
    price: Joi.number().required()
});

exports.updateReservationSchema = Joi.object({
    id_mountain: Joi.number(),
    start_date: Joi.date(),
    name: Joi.string().max(255),
    nik: Joi.string().max(255),
    gender: Joi.string().valid('male', 'female'),
    phone_number: Joi.string().max(255),
    address: Joi.string(),
    citizen: Joi.string().max(255),
    price: Joi.number()
});