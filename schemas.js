const Joi = require("joi");

const reservationSchema = Joi.object().keys({
  start_date: Joi.date().required().min(new Date()).messages({
    "date.base": `"start_date" debe ser de tipo 'date'`,
    "date.empty": `"start_date" no puede estar vacío`,
    "date.min": `"start_date" no puede ser anterior a la {#limit}`,
    "any.required": `"start_date" es un campo requerido`,
  }),
  end_date: Joi.date().required().min(new Date()).messages({
    "date.base": `"end_date" debe ser de tipo 'date'`,
    "date.empty": `"end_date" no puede estar vacío`,
    "date.min": `"end_date" no puede ser anterior a {#limit}`,
    "any.required": `"end_date" es un campo requerido`,
  }),
  pack_id: Joi.number().required().positive().integer().messages({
    "number.base": `"pack_id" debe ser de tipo 'number'`,
    "number.empty": `"pack_id" no puede estar vacío`,
    "number.positive": `"pack_id" debe ser un valor positivo`,
    "number.integer": `"pack_id" debe ser un valor entero`,
    "number.required": `"pack_id" es un campo requerido`,
  }),
  space_id: Joi.number().positive().integer().messages({
    "number.base": `"space_id" debe ser de tipo 'number'`,
    "number.empty": `"space_id" no puede estar vacío`,
    "number.positive": `"space_id" debe ser un valor positivo`,
    "number.integer": `"space_id" debe ser un valor entero`,
  }),
});

const userSchema = Joi.object().keys({
  name: Joi.string().required().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacío`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  surname: Joi.string().required().max(100).messages({
    "string.base": `"surname" debe ser de tipo 'string'`,
    "string.empty": `"surname" no puede estar vacío`,
    "string.max": `"surname" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"surname" es un campo requerido`,
  }),
  nif: Joi.string().required().max(9).messages({
    "string.base": `"nif" debe ser de tipo 'string'`,
    "string.empty": `"nif" no puede estar vacío`,
    "string.max": `"nif" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"nif" es un campo requerido`,
  }),
  email: Joi.string().email().required().max(100).messages({
    "string.base": `"email" debe ser de tipo 'string'`,
    "string.empty": `"email" no puede estar vacío`,
    "string.max": `"email" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"email" es un campo requerido`,
  }),
  password: Joi.string().required().max(100).messages({
    "string.base": `"password" debe ser de tipo 'string'`,
    "string.empty": `"password" no puede estar vacío`,
    "string.max": `"password" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"password" es un campo requerido`,
  }),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required().max(100).messages({
    "string.base": `"email" debe ser de tipo 'string'`,
    "string.empty": `"email" no puede estar vacío`,
    "string.max": `"email" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"email" es un campo requerido`,
  }),
  password: Joi.string().required().max(100).messages({
    "string.base": `"password" debe ser de tipo 'string'`,
    "string.empty": `"password" no puede estar vacío`,
    "string.max": `"password" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"password" es un campo requerido`,
  }),
});

const editUserSchema = Joi.object().keys({
  name: Joi.string().required().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacío`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  surname: Joi.string().required().max(100).messages({
    "string.base": `"surname" debe ser de tipo 'string'`,
    "string.empty": `"surname" no puede estar vacío`,
    "string.max": `"surname" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"surname" es un campo requerido`,
  }),
  nif: Joi.string().required().max(9).messages({
    "string.base": `"nif" debe ser de tipo 'string'`,
    "string.empty": `"nif" no puede estar vacío`,
    "string.max": `"nif" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"nif" es un campo requerido`,
  }),
  company: Joi.string().required().max(50).messages({
    "string.base": `"company" debe ser de tipo 'string'`,
    "string.empty": `"company" no puede estar vacío`,
    "string.max": `"company" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"company" es un campo requerido`,
  }),
  tel: Joi.string().required().max(30).messages({
    "string.base": `"tel" debe ser de tipo 'string'`,
    "string.empty": `"tel" no puede estar vacío`,
    "string.max": `"tel" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"tel" es un campo requerido`,
  }),
  email: Joi.string().required().email().max(100).messages({
    "string.base": `"email" debe ser un email válido`,
    "string.empty": `"email" no puede estar vacío`,
    "string.max": `"email" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"email" es un campo requerido`,
  }),
  admin: Joi.number().allow("").integer().min(0).max(1).messages({
    "number.base": `'admin' debe ser de tipo 'number'`,
    "number.min": `'admin' debe ser 0 o 1`,
    "number.max": `'admin' debe ser 0 o 1`,
  }),
  deleted: Joi.number().allow("").integer().min(0).max(1).messages({
    "number.base": `'deleted' debe ser de tipo 'number'`,
    "number.min": `'deleted' debe ser 0 o 1`,
    "number.max": `'deleted' debe ser 0 o 1`,
  }),
  deletePhoto: Joi.number().allow("").integer().min(0).max(1).messages({
    "number.base": `'deletePhoto' debe ser de tipo 'number'`,
    "number.min": `'deletePhoto' debe ser 0 o 1`,
    "number.max": `'deletePhoto' debe ser 0 o 1`,
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
    "string.empty": `"description" no puede estar vacío`,
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
    "number.min": `'solved' debe ser 0 o 1`,
    "number.max": `'solved' debe ser 0 o 1`,
  }),
  user_name: Joi.string().allow("").max(150).messages({
    "string.base": `"user_name" debe ser de tipo 'string'`,
    "string.max": `"user_name" no puede ser mayor de {#limit} caracteres`,
  }),
  orderBy: Joi.string().valid(
    "id",
    "report_date",
    "solved",
    "user_id",
    "space_id",
    "user_name"
  ),

  orderDirection: Joi.string().valid("ASC", "DESC"),
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
    ),
  description: Joi.string().required().max(60000).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacío`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  name: Joi.string().required().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacío`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  price: Joi.number().required().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacío`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
  capacity: Joi.number().required().positive().integer().messages({
    "number.base": `"capacity" debe ser de tipo 'number'`,
    "number.empty": `"capacity" no puede estar vacío`,
    "number.positive": `"capacity" debe ser un valor positivo`,
    "number.integer": `"capacity" debe ser un valor entero`,
  }),
});
const filterSpaceSchema = Joi.object().keys({
  type: Joi.any().valid(
    "Sala de reuniones",
    "Oficina individual",
    "Auditorio",
    "Sala audiovisual",
    "Oficina compartida"
  ),
  description: Joi.string().max(60000).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacío`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  name: Joi.string().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacío`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  price: Joi.number().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacío`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
  capacity: Joi.number().positive().integer().messages({
    "number.base": `"capacity" debe ser de tipo 'number'`,
    "number.empty": `"capacity" no puede estar vacío`,
    "number.positive": `"capacity" debe ser un valor positivo`,
    "number.integer": `"capacity" debe ser un valor entero`,
  }),
  start_date: Joi.date().min(new Date()).messages({
    "date.base": `"start_date" debe ser de tipo 'date'`,
    "date.empty": `"start_date" no puede estar vacío`,
    "date.min": `"start_date" no puede ser anterior a la {#limit}`,
    "any.required": `"start_date" es un campo requerido`,
  }),
  end_date: Joi.date()
    .min(new Date())
    .messages({
      "date.base": `"end_date" debe ser de tipo 'date'`,
      "date.empty": `"end_date" no puede estar vacío`,
      "date.min": `"end_date" no puede ser anterior a ${new Date()}`,
      "any.required": `"end_date" es un campo requerido`,
    }),

  order: Joi.string().valid(
    "type",
    "price",
    "score",
    "capacity",
    "start_date",
    "end_date"
  ),
  direction: Joi.string().valid("ASC", "DESC"),
});

const filterSpaceAdminSchema = Joi.object().keys({
  type: Joi.any().valid(
    "Sala de reuniones",
    "Oficina individual",
    "Auditorio",
    "Sala audiovisual",
    "Oficina compartida"
  ),
  description: Joi.string().max(60000).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacío`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  name: Joi.string().max(50).messages({
    "string.base": `"name" debe ser de tipo 'string'`,
    "string.empty": `"name" no puede estar vacío`,
    "string.max": `"name" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"name" es un campo requerido`,
  }),
  price: Joi.number().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacío`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
  capacity: Joi.number().positive().integer().messages({
    "number.base": `"capacity" debe ser de tipo 'number'`,
    "number.empty": `"capacity" no puede estar vacío`,
    "number.positive": `"capacity" debe ser un valor positivo`,
    "number.integer": `"capacity" debe ser un valor entero`,
  }),
  enabled: Joi.number().valid(0, 1),
  start_date: Joi.date().min(new Date()).messages({
    "date.base": `"start_date" debe ser de tipo 'date'`,
    "date.empty": `"start_date" no puede estar vacío`,
    "date.min": `"start_date" no puede ser anterior a la {#limit}`,
    "any.required": `"start_date" es un campo requerido`,
  }),
  end_date: Joi.date()
    .min(new Date())
    .messages({
      "date.base": `"end_date" debe ser de tipo 'date'`,
      "date.empty": `"end_date" no puede estar vacío`,
      "date.min": `"end_date" no puede ser anterior a ${new Date()}`,
      "any.required": `"end_date" es un campo requerido`,
    }),

  order: Joi.string().valid(
    "type",
    "price",
    "score",
    "capacity",
    "start_date",
    "end_date",
    "enabled"
  ),
  direction: Joi.string().valid("ASC", "DESC"),
});

//user_id, name,surname,company,admin,verified,deleted,registration_date,
const filterUserSchema = Joi.object().keys({
  user_id: Joi.number().allow("").integer().positive().messages({
    "number.base": `"user_id" debe ser de tipo 'number'`,
    "number.positive": `"user_id" debe ser un valor positivo`,
    "number.integer": `"user_id" debe ser un valor entero`,
  }),
  name: Joi.string().allow("").max(50).messages({
    "string.base": `'name' debe ser de tipo 'string'`,
    "string.max": `'name' no puede tener más de {#limit} caracteres`,
  }),
  surname: Joi.string().allow("").max(100).messages({
    "string.base": `'surname' debe ser de tipo 'string'`,
    "string.max": `'surname' no puede tener más de {#limit} caracteres`,
  }),
  company: Joi.string().allow("").max(50).messages({
    "string.base": `'company' debe ser de tipo 'string'`,
    "string.max": `'company' no puede tener más de {#limit} caracteres`,
  }),
  admin: Joi.number().allow("").optional(0).max(1).min(0).messages({
    "number.base": `"admin" debe ser de tipo 'number'`,
    "number.positive": `"admin" debe ser un valor positivo`,
    "number.integer": `"admin" debe ser un valor entero`,
    "number.min": `'admin' puede ser como mínimo {#limit}`,
    "number.max": `'admin' puede ser como máximo {#limit}`,
  }),
  verified: Joi.number().allow("").optional(1).max(1).min(0).messages({
    "number.base": `"verified" debe ser de tipo 'number'`,
    "number.positive": `"verified" debe ser un valor positivo`,
    "number.integer": `"verified" debe ser un valor entero`,
    "number.min": `'verified' puede ser como mínimo {#limit}`,
    "number.max": `'verified' puede ser como máximo {#limit}`,
  }),
  deleted: Joi.number().allow("").optional(0).max(1).min(0).messages({
    "number.base": `"verified" debe ser de tipo 'number'`,
    "number.positive": `"verified" debe ser un valor positivo`,
    "number.integer": `"verified" debe ser un valor entero`,
    "number.min": `'verified' puede ser como mínimo {#limit}`,
    "number.max": `'verified' puede ser como máximo {#limit}`,
  }),
  registration_date: Joi.date().allow("").max(new Date()).messages({
    "date.base": `"registration_date" debe ser de tipo 'date'`,
    "any.required": `"registration_date" es un campo requerido`,
    "date.max": `'registration_date' no puede ser mayor que {#limit}`,
  }),
  orderBy: Joi.string().valid(
    "id",
    "name",
    "surname",
    "company",
    "admin",
    "verified",
    "deleted",
    "registration_date"
  ),
  orderDirection: Joi.string().valid("ASC", "DESC"),
});

const newPackSchema = Joi.object().keys({
  type: Joi.string().max(50).required().messages({
    "string.base": `"type" debe ser de tipo 'string'`,
    "string.empty": `"type" no puede estar vacío`,
    "string.max": `"type" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"type" es un campo requerido`,
  }),
  content: Joi.string().required().max(400).messages({
    "string.base": `"description" debe ser de tipo 'string'`,
    "string.empty": `"description" no puede estar vacío`,
    "string.max": `"description" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"description" es un campo requerido`,
  }),
  price: Joi.number().required().positive().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacío`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
});
const newReviewSchema = Joi.object().keys({
  comment: Joi.string().required().max(400).messages({
    "string.base": `"comment" debe ser de tipo 'string'`,
    "string.empty": `"comment" no puede estar vacío`,
    "string.max": `"comment" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"comment" es un campo requerido`,
  }),
  score: Joi.number().required().positive().integer().max(10).messages({
    "number.base": `"score" debe ser de tipo 'number'`,
    "number.empty": `"score" no puede estar vacío`,
    "number.positive": `"score" debe ser un valor positivo`,
    "number.integer": `"score" debe ser un valor entero`,
    "string.max": `"score" no puede ser mayor de {#limit} `,
  }),
});

const filterReviewsSchema = Joi.object().keys({
  review_id: Joi.number().positive().integer().messages({
    "number.base": `"score" debe ser de tipo 'number'`,
    "number.empty": `"score" no puede estar vacio`,
    "number.positive": `"score" debe ser un valor positivo`,
    "number.integer": `"score" debe ser un valor entero`,
    "string.max": `"score" no puede ser mayor de {#limit} `,
    "string.min": `"score" no puede ser menor que {#limit} `,
  }),

  user_id: Joi.number().positive().integer().messages({
    "number.base": `"score" debe ser de tipo 'number'`,
    "number.empty": `"score" no puede estar vacio`,
    "number.positive": `"score" debe ser un valor positivo`,
    "number.integer": `"score" debe ser un valor entero`,
    "string.max": `"score" no puede ser mayor de {#limit} `,
    "string.min": `"score" no puede ser menor que {#limit} `,
  }),
  review_date: Joi.date().messages({
    "date.base": `"end_date" debe ser de tipo 'date'`,
    "date.empty": `"end_date" no puede estar vacio`,
    "any.required": `"end_date" es un campo requerido`,
  }),
  order: Joi.string().valid(
    "id",
    "space_id",
    "user_id",
    "score",
    "review_date",
    "comment",
    "user_name"
  ),
  direction: Joi.string().valid("ASC", "DESC"),
  user_name: Joi.string().allow("").max(150).messages({
    "string.base": `"user_name" debe ser de tipo 'string'`,
    "string.max": `"user_name" no puede ser mayor de {#limit} caracteres`,
  }),
});
const recoverUserPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required().max(100).messages({
    "string.base": `"email" debe ser de tipo 'string'`,
    "string.empty": `"email" no puede estar vacío`,
    "string.max": `"email" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"email" es un campo requerido`,
  }),
});
const resetUserPasswordSchema = Joi.object().keys({
  recoverCode: Joi.string().min(4).required().messages({
    "string.base": `"type" debe ser de tipo 'string'`,
    "string.empty": `"type" no puede estar vacio`,
    "string.min": `"score" no puede ser menor que {#limit} `,
  }),
  newPassword: Joi.string().required().messages({
    "string.base": `"type" debe ser de tipo 'string'`,
    "string.empty": `"type" no puede estar vacio`,
  }),
});

const editPasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required().max(100).messages({
    "string.base": `"oldPassword" debe ser de tipo 'string'`,
    "string.empty": `"oldPassword" no puede estar vacío`,
    "string.max": `"oldPassword" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"oldPassword" es un campo requerido`,
  }),
  newPassword: Joi.string().required().min(8).max(100).messages({
    "string.base": `"newPassword" debe ser de tipo 'string'`,
    "string.empty": `"newPassword" no puede estar vacío`,
    "string.min": `"newPassword" debe tener un mínimo de 8 caracteres`,
    "string.max": `"newPassword" no puede ser mayor de {#limit} caracteres`,
    "any.required": `"newPassword" es un campo requerido`,
  }),
});
const getPackSchema = Joi.object().keys({
  order: Joi.valid("ID", "type", "content", "price", "photo"),
  direction: Joi.valid("ASC", "DESC"),
});
module.exports = {
  reservationSchema,
  userSchema,
  editUserSchema,
  loginSchema,
  newReportSchema,
  filterReportSchema,
  newSpaceSchema,
  filterSpaceSchema,
  newPackSchema,
  newReviewSchema,
  filterReviewsSchema,
  recoverUserPasswordSchema,
  filterUserSchema,
  resetUserPasswordSchema,
  editPasswordSchema,
  filterSpaceAdminSchema,
  getPackSchema,
};
