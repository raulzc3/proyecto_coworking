const Joi = require("joi");

const reservationSchema = Joi.object().keys({
  start_date: Joi.date().required().min(new Date()).messages({
    "date.base": `"start_date" debe ser de tipo 'date'`,
    "date.empty": `"start_date" no puede estar vacio`,
    "date.min": `"start_date" no puede ser anterior a la {#limit}`,
    "any.required": `"start_date" es un campo requerido`,
  }),
  end_date: Joi.date().required().min(new Date()).messages({
    "date.base": `"end_date" debe ser de tipo 'date'`,
    "date.empty": `"end_date" no puede estar vacio`,
    "date.min": `"end_date" no puede ser anterior a {#limit}`,
    "any.required": `"end_date" es un campo requerido`,
  }),
  pack_id: Joi.number().required().positive().integer().messages({
    "number.base": `"pack_id" debe ser de tipo 'number'`,
    "number.empty": `"pack_id" no puede estar vacio`,
    "number.positive": `"pack_id" debe ser un valor positivo`,
    "number.integer": `"pack_id" debe ser un valor entero`,
    "number.required": `"pack_id" es un campo requerido`,
  }),
  space_id: Joi.number().positive().integer().messages({
    "number.base": `"space_id" debe ser de tipo 'number'`,
    "number.empty": `"space_id" no puede estar vacio`,
    "number.positive": `"space_id" debe ser un valor positivo`,
    "number.integer": `"space_id" debe ser un valor entero`,
  }),
});

const userSchema = Joi.object().keys({
  name: Joi.string().required().max(50).messages({
    "string.base": `"name" debe ser de tipo 'date'`,
    "string.empty": `"name" no puede estar vacio`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  surname: Joi.string().required().max(100).messages({
    "string.base": `"surname" debe ser de tipo 'string'`,
    "string.empty": `"surname" no puede estar vacio`,
    "string.max": `"surname" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"surname" es un campo requerido`,
  }),
  nif: Joi.string().required().max(9).messages({
    "string.base": `"nif" debe ser de tipo 'string'`,
    "string.empty": `"nif" no puede estar vacio`,
    "string.max": `"nif" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"nif" es un campo requerido`,
  }),
  email: Joi.string().email().required().max(100).messages({
    "string.base": `"email" debe ser de tipo 'string'`,
    "string.empty": `"email" no puede estar vacio`,
    "string.max": `"email" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"email" es un campo requerido`,
  }),
  password: Joi.string().required().max(100).messages({
    "string.base": `"password" debe ser de tipo 'string'`,
    "string.empty": `"password" no puede estar vacio`,
    "string.max": `"password" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"password" es un campo requerido`,
  }),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required().max(100).messages({
    "string.base": `"email" debe ser de tipo 'string'`,
    "string.empty": `"email" no puede estar vacio`,
    "string.max": `"email" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"email" es un campo requerido`,
  }),
  password: Joi.string().required().max(100).messages({
    "string.base": `"password" debe ser de tipo 'string'`,
    "string.empty": `"password" no puede estar vacio`,
    "string.max": `"password" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"password" es un campo requerido`,
  }),
});

module.exports = { reservationSchema, userSchema, loginSchema };
