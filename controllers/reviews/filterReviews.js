const { validator } = require("../../helpers");
const { filterReviewsSchema } = require("../../schemas");

const filterReviews = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();

    //Verifico los datos del query
    await validator(filterReviewsSchema, req.query);
    //Filtrar por id/usuario/tipo de espacio/fecha
    const {
      review_id,
      user_id,
      review_date,
      order,
      direction,
      space_id,
      user_name,
    } = req.query;

    review_date ? new Date(review_date) : new Date(1111 - 11 - 11);
    const orderBy = order ? order : `score`;
    const orderDirection = direction ? direction : `ASC`;
    const [results] = await connection.query(
      `
  SELECT r.id as "id", CONCAT(name, " ", surname) "user_name", comment, score, review_date, user_id, space_id
  FROM reviews r JOIN users u ON r.user_id = u.id
  WHERE (r.ID = ? OR ?) AND (CONCAT(name, " ", surname) LIKE ? OR ?) AND (user_id =? OR ?) AND (space_id =? OR ?) AND (DATE(review_date)=DATE(?) OR ?)
  ORDER BY ${orderBy} ${orderDirection};
  `,
      [
        review_id,
        !review_id,
        `%${user_name}%`,
        !user_name,
        user_id,
        !user_id,
        space_id,
        !space_id,
        review_date,
        !review_date,
      ]
    );

    console.log("dentro");
    res.send({
      status: "ok",
      data: [...results],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = filterReviews;
