const userExists = require("./userExists");
const spaceExists = require("./spaceExists");
const reservationExists = require("./reservationExists");
const reportExists = require("./reportExists");
const reviewExists = require("./reviewExists");
const isAuthorized = require("./isAuthorized");
const isAdmin = require("./isAdmin");

module.exports = {
  userExists,
  spaceExists,
  reservationExists,
  reportExists,
  reviewExists,
  isAuthorized,
  isAdmin,
};
