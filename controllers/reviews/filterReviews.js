const { formatDateToDB, validator } = require("../../helpers");
const {filterReviewsSchema}=require("../../schemas")
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
      type,
      review_date,
      order,
      direction,
    } = req.query;

    const validOrderFields = ["space_id", "user_id", "type", "review_date"];
    const validOrderDirection = ["DESC", "ASC"];

    const formatedReviewDate = review_date
      ? formatDateToDB(new Date(review_date))
      : formatDateToDB(new Date(1111 - 11 - 11));
    const orderBy = validOrderFields.includes(order) ? order : "score";
    const orderDirection = validOrderDirection.includes(direction)
      ? direction
      : "ASC";

    let results;

    if (review_id || user_id || type || review_date) {
      [results] = await connection.query(
        `
    SELECT DISTINCT r.ID, r.comment, r.score, DATE(r.review_date),r.user_id,e.type
    FROM spaces e LEFT JOIN reviews r ON (e.ID=r.space_id)
    WHERE (r.ID = ? OR ?) AND (r.user_id =? OR ?) AND (e.type LIKE ? OR ?) AND (DATE(r.review_date)=DATE(?) OR ?)
    ORDER BY "${orderBy}", "${orderDirection}";
    `,
        [
          review_id,
          !review_id,
          user_id,
          !user_id,
          type,
          !type,
          formatedReviewDate,
          !formatedReviewDate,
        ]
      );
    } else {
      [results] = await connection.query(`
      SELECT DISTINCT r.ID, r.comment, r.score, DATE(r.review_date),r.user_id,e.type
      FROM spaces e LEFT JOIN reviews r ON (e.ID=r.space_id)
      ORDER BY "${orderBy}", "${orderDirection}";`);
    }

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
module.exports = filterReviews;
