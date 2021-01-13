const { validator } = require("../../helpers");
const { filterUserSchema } = require("../../schemas");

const filterUsers = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    // Filtrar por id, usuario, espacio, categoria, fecha de incidencia y estado
    let {
      user_id,
      name,
      surname,
      company,
      admin,
      verified,
      deleted,
      registration_date,
      orderBy,
      orderDirection,
    } = req.query;

    orderBy = orderBy ? orderBy.toLowerCase() : "id";
    orderDirection = orderDirection ? orderDirection.toUpperCase() : "ASC";

    await validator(filterUserSchema, {
      user_id,
      name,
      surname,
      company,
      admin,
      verified,
      deleted,
      registration_date,
      orderBy,
      orderDirection,
    });

    const [results] = await connection.query(
      `
        SELECT *
        FROM users
        WHERE (id = ? OR ?) 
                AND (name LIKE ? OR ?) 
                AND (surname LIKE ? OR ?) 
                AND (company LIKE ? OR ?)
                AND (admin = ? OR ?)
                AND (verified = ? OR ?) 
                AND (deleted = ? OR ?) 
                AND (DATE(registration_date) = DATE(?) OR ?) 
        ORDER BY ${orderBy} ${orderDirection}
    `,
      [
        user_id,
        !user_id,
        `%${name}%`,
        !name,
        `%${surname}%`,
        !surname,
        `%${company}%`,
        !company,
        admin,
        !admin,
        verified,
        !verified,
        deleted,
        !deleted,
        registration_date,
        !registration_date,
        orderBy,
        orderDirection,
      ]
    );

    res.send({
      status: "ok",
      data: {
        ...results,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = filterUsers;
