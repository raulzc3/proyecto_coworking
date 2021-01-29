const Joi = require("joi");
//lista de funciones que devuelven validaciones usadas reiteredas veces en los schemas
/**
 * 
 * @param {String} varName :Nombre del parámetro a validar
 * @param {Number} max :Número máximo de caracteres
 */
const maxTextValidator = (varName, max) => {
  return Joi.string()
    .allow("")
    .max(max)
    .messages({
      "string.base": `${varName} debe ser de tipo 'string'`,
      "string.max": `${varName} no puede tener más de {#limit} caracteres`,
    });
};
/**
 * 
 * @param {String} varName :Nombre del parámetro a validar
 * @param {Number} max :Número máximo de caracteres
 * @param {Number} min :Número mínimo de caracteres
 */
const textRequiredValidator = (varName, max, min = 0) => {
  return Joi.string()
    .required()
    .min(min)
    .max(max)
    .messages({
      "string.base": `${varName} debe ser de tipo 'string'`,
      "string.empty": `${varName} no puede estar vacío`,
      "string.min": `${varName} debe ser mayor de {#limit} caracteres`,
      "string.max": `${varName} no puede ser mayor de {#limit} caracteres`,
      "any.required": `${varName} es un campo requerido`,
    });
};
/**
 * 
 * @param {String} varName :Nombre del parámetro a validar
 */
const dateRequiredValidator = (varName) => {
  return Joi.date()
    .required()
    .min(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )
    )
    .messages({
      "date.base": `${varName} debe ser de tipo 'date'`,
      "date.empty": `${varName}  no puede estar vacío`,
      "date.min": `${varName}  no puede ser anterior a la {#limit}`,
      "any.required": `${varName}  es un campo requerido`,
    });
};
/**
 * 
 * @param {String} varName :Nombre del parámetro a validar
 */
const dateValidator = (varName) => {
  return Joi.date()
    .min(new Date())
    .messages({
      "date.base": `${varName}  debe ser de tipo 'date'`,
      "date.empty": `${varName}  no puede estar vacío`,
      "date.min": `${varName}  no puede ser anterior a la {#limit}`,
      "any.required": `${varName}  es un campo requerido`,
    });
};
/**
 * 
 * @param {String} varName :Nombre del parámetro a validar
 */
const numberValidator = (varName) => {
  return Joi.number()
    .positive()
    .integer()
    .messages({
      "number.base": `${varName} debe ser de tipo 'number'`,
      "number.empty": `${varName} no puede estar vacío`,
      "number.positive": `${varName} debe ser un valor positivo`,
      "number.integer": `${varName} debe ser un valor entero`,
      "number.required": `${varName} es un campo requerido`,
    });
};

const reservationSchema = Joi.object().keys({
  start_date: dateRequiredValidator("start_date"),
  end_date: dateRequiredValidator("end_date"),
  pack_id: numberValidator("pack_id"),
  space_id: numberValidator("space_id"),
});

const userSchema = Joi.object().keys({
  name: textRequiredValidator("name", 50),
  surname: textRequiredValidator("surname", 100),
  nif: textRequiredValidator("nif", 9),
  email: textRequiredValidator("email", 100),
  password: textRequiredValidator("password", 100),
});

const loginSchema = Joi.object().keys({
  email: textRequiredValidator("email", 100),
  password: textRequiredValidator("password", 100),
});

const editUserSchema = Joi.object().keys({
  name: textRequiredValidator("name", 50),
  surname: textRequiredValidator("surname", 100),
  nif: textRequiredValidator("nif", 9),
  company: textRequiredValidator("company", 50),
  tel: textRequiredValidator("tel", 30),
  email: textRequiredValidator("email", 100),
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
  description: textRequiredValidator("description", 500, 30),
});

//Schema para filtrar reportes (los campos serán opcionales)
const filterReportSchema = Joi.object().keys({
  report_id: numberValidator("report_id"),
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
  description: textRequiredValidator("description", 4000),
  name: textRequiredValidator("name", 50),
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
  description: textRequiredValidator("description", 4000),
  name: textRequiredValidator("name", 50),
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
  start_date: dateValidator("start_date"),
  end_date: dateValidator("end_date"),
  order: Joi.string().valid(
    "type",
    "price",
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
  description: textRequiredValidator("description", 4000),
  name: textRequiredValidator("name", 50),
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
  start_date: dateValidator("start_date"),
  end_date: dateValidator("end_date"),

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
  user_id: numberValidator("user_id"),
  name: maxTextValidator("name", 50),
  surname: maxTextValidator("surname", 100),
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
  type: textRequiredValidator("type", 50),
  content: textRequiredValidator("content", 400),
  price: Joi.number().required().messages({
    "number.base": `"price" debe ser de tipo 'number'`,
    "number.empty": `"price" no puede estar vacío`,
    "number.positive": `"price" debe ser un valor positivo`,
  }),
});
const newReviewSchema = Joi.object().keys({
  comment: textRequiredValidator("type", 400),
  score: Joi.number().required().positive().integer().max(10).messages({
    "number.base": `"score" debe ser de tipo 'number'`,
    "number.empty": `"score" no puede estar vacío`,
    "number.positive": `"score" debe ser un valor positivo`,
    "number.integer": `"score" debe ser un valor entero`,
    "string.max": `"score" no puede ser mayor de {#limit} `,
  }),
});

const filterReviewsSchema = Joi.object().keys({
  review_id: numberValidator("review_id"),

  user_id: numberValidator("user_id"),
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
  email: textRequiredValidator("email", 100),
});
const resetUserPasswordSchema = Joi.object().keys({
  recoverCode: textRequiredValidator("recoverCode", 100, 4),
  newPassword: Joi.string().required().messages({
    "string.base": `"type" debe ser de tipo 'string'`,
    "string.empty": `"type" no puede estar vacio`,
  }),
});

const editPasswordSchema = Joi.object().keys({
  oldPassword: textRequiredValidator("oldPassword", 100),
  newPassword: textRequiredValidator("newPassword", 100, 8),
});
const getPackSchema = Joi.object().keys({
  order: Joi.valid("ID", "type", "content", "price", "photo"),
  direction: Joi.valid("ASC", "DESC"),
});

const filterBookingsSchema = Joi.object().keys({
  reservation_id: numberValidator("reservation_id"),
  space_id: numberValidator("space_id"),
  space_type: Joi.string()
    .valid(
      "Sala audiovisual",
      "Sala de reuniones",
      "Oficina compartida",
      "Oficina individual",
      "Auditorio",
      ""
    )
    .messages({
      "string.base": `"space_type" debe ser de tipo 'string'`,
    }),
  space_name: Joi.string().allow("").messages({
    "string.base": `"space_name" debe ser de tipo 'string'`,
  }),
  user_id: numberValidator("user_id"),
  user_full_name: Joi.string().allow("").max(150).messages({
    "string.base": `"user_full_name" debe ser de tipo 'string'`,
    "string.max": `"user_full_name" no puede ser mayor de {#limit} caracteres`,
  }),
  pack: Joi.string()
    .valid("Básico", "Intermedio", "Audiovisual", "Informático", "")
    .messages({
      "string.base": `"pack" debe ser de tipo 'string'`,
    }),
  start_date: Joi.date().allow("").messages({
    "date.base": `"start_date" debe ser de tipo 'date'`,
  }),
  end_date: Joi.date().allow("").messages({
    "date.base": `"end_date" debe ser de tipo 'date'`,
  }),
  order_date: Joi.date().allow("").messages({
    "date.base": `"order_date" debe ser de tipo 'date'`,
  }),
  orderDirection: Joi.string().valid("ASC", "DESC").messages({
    "string.base": `"orderDirection" debe ser de tipo 'string'`,
  }),
  orderBy: Joi.string()
    .valid(
      "id",
      "space_type",
      "space_name",
      "space_id",
      "full_name_user",
      "user_id",
      "pack",
      "start_date",
      "end_date",
      "order_date",
      ""
    )
    .messages({
      "string.base": `"orderBy" debe ser de tipo 'string'`,
    })
    .messages({
      "string.base": `"orderBy" debe ser de tipo 'string'`,
    }),
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
  filterBookingsSchema,
};
