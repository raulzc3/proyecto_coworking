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

const newReportSchema = Joi.object().keys({
  category: Joi.any().valid(
    "hardware",
    "software",
    "conectividad",
    "limpieza",
    "atención al cliente",
    "otros"
  ),
  description: Joi.string().required().min(30).max(500).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacio`,
    "string.min": `'description' debe ser mayor de {#limit} caracteres`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
});

//Schema para filtrar reportes (los campos serán opcionales)
const filterReportSchema = Joi.object().keys({
  report_id: Joi.number().allow("").integer().positive().messages({
    "number.base": `'report_id' debe ser de tipo 'number'`,
  }),
  user: Joi.number().allow("").integer().positive().messages({
    "number.base": `'user_id' debe ser de tipo 'number'`,
  }),
  space: Joi.number().allow("").integer().positive().messages({
    "number.base": `'space_id' debe ser de tipo 'number'`,
  }),
  date: Joi.date().allow("").optional().max(new Date()).messages({
    "date.base": `'date' debe ser de tipo 'date'`,
    "date.max": `'date' no puede ser posterior a la fecha actual`,
  }),
  category: Joi.any().valid(
    "hardware",
    "software",
    "conectividad",
    "limpieza",
    "atención al cliente",
    "otros",
    ""
  ),
  solved: Joi.number().allow("").integer().min(0).max(1).messages({
    "number.base": `'solved' debe ser de tipo 'number'`,
    "number.min": `'solved' debe ser 1 o 0`,
    "number.max": `'solved' debe ser 1 o 0`,
  }),
});
const newSpaceSchema = Joi.object().keys({
  type: Joi.string()
    .required()
    .valid(
      "Sala de reuniones",
      "Oficina individual",
      "Auditorio",
      "Sala audiovisual",
      "Oficina compartida"
    )
    .messages({
      "string.base": `"type" debe ser de tipo 'string'`,
      "string.empty": `"type" no puede estar vacio`,
      "string.max": `"type" no puede ser mayor de {#limit} caracteres`,
      "any.required": `"type" es un campo requerido`,
    }),
  description: Joi.string().required().max(60000).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacio`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  name: Joi.string().required().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacio`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  price: Joi.number().required().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacio`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
  capacity: Joi.number().required().positive().integer().messages({
    "number.base": `"capacity" debe ser de tipo 'number'`,
    "number.empty": `"capacity" no puede estar vacio`,
    "number.positive": `"capacity" debe ser un valor positivo`,
    "number.integer": `"capacity" debe ser un valor entero`,
  }),
});
const filterSpaceSchema = Joi.object().keys({
  type: Joi.any()
    .valid(
      "Sala de reuniones",
      "Oficina individual",
      "Auditorio",
      "Sala audiovisual",
      "Oficina compartida"
    )
    .messages({
      "string.base": `"type" debe ser de tipo 'string'`,
      "string.empty": `"type" no puede estar vacio`,
      "string.max": `"type" no puede ser mayor de {#limit} caracteres`,
      "any.required": `"type" es un campo requerido`,
    }),
  description: Joi.string().max(60000).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacio`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  name: Joi.string().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacio`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  price: Joi.number().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacio`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
  capacity: Joi.number().positive().integer().messages({
    "number.base": `"capacity" debe ser de tipo 'number'`,
    "number.empty": `"capacity" no puede estar vacio`,
    "number.positive": `"capacity" debe ser un valor positivo`,
    "number.integer": `"capacity" debe ser un valor entero`,
  }),
  start_date: Joi.date().min(new Date()).messages({
    "date.base": `"start_date" debe ser de tipo 'date'`,
    "date.empty": `"start_date" no puede estar vacio`,
    "date.min": `"start_date" no puede ser anterior a la {#limit}`,
    "any.required": `"start_date" es un campo requerido`,
  }),
  end_date: Joi.date()
    .min(new Date())
    .messages({
      "date.base": `"end_date" debe ser de tipo 'date'`,
      "date.empty": `"end_date" no puede estar vacio`,
      "date.min": `"end_date" no puede ser anterior a ${new Date()}`,
      "any.required": `"end_date" es un campo requerido`,
    }),

  order: Joi.string()
    .valid("type", "price", "score", "capacity", "start_date", "end_date")
    .messages({
      "string.base": `"type" debe ser de tipo 'string'`,
      "string.empty": `"type" no puede estar vacio`,
    }),

  direction: Joi.string().valid("ASC", "DESC").messages({
    "string.base": `"type" debe ser de tipo 'string'`,
    "string.empty": `"type" no puede estar vacio`,
    "string.valid": `"type" solo acepta los valores ASC y DESC`,
  }),
});

const newPackSchema = Joi.object().keys({
  type: Joi.string()
    .required()
    .valid("Básico", "Intermedio", "Audiovisual", "Informático")
    .messages({
      "string.base": `"type" debe ser de tipo 'string'`,
      "string.empty": `"type" no puede estar vacio`,
      "string.max": `"type" no puede ser mayor de {#limit} caracteres`,
      "any.required": `"type" es un campo requerido`,
    }),
  content: Joi.string().required().max(400).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacio`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  price: Joi.number().required().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacio`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
});
const newReviewSchema = Joi.object().keys({
  comment: Joi.string().required().max(400).messages({
    "string.base": `"comment" debe ser de tipo 'string'`,
    "string.empty": `"comment" no puede estar vacio`,
    "string.max": `"comment" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"comment" es un campo requerido`,
  }),
  score: Joi.number().required().positive().integer().max(10).messages({
    "number.base": `"score" debe ser de tipo 'number'`,
    "number.empty": `"score" no puede estar vacio`,
    "number.positive": `"score" debe ser un valor positivo`,
    "number.integer": `"score" debe ser un valor entero`,
    "string.max": `"score" no puede ser mayor de {#limit} `,
  }),
});

module.exports = {
  reservationSchema,
  userSchema,
  loginSchema,
  newReportSchema,
  filterReportSchema,
  newSpaceSchema,
  filterSpaceSchema,
  newPackSchema,
  newReviewSchema,
};
