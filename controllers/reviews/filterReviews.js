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
      space_id
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

    [results] = await connection.query(
      `
  SELECT DISTINCT *
  FROM reviews
  WHERE (ID = ? OR ?) AND (user_id =? OR ?)AND (space_id =? OR ?) AND  (DATE(review_date)=DATE(?) OR ?)
  ORDER BY "${orderBy}", "${orderDirection}";
  `,
      [
        review_id,
        !review_id,
        user_id,
        !user_id,
        space_id,
        !space_id,
        type,
        !type,
        formatedReviewDate,
        !formatedReviewDate,
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
module.exports = filterReviews;
