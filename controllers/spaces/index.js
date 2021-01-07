const getSpace = require("./getSpace");
const filterSpaces = require("./filterSpaces");
const getReservation = require("./getReservation");
const newSpace = require("./newSpace");
const editReservation = require("./editReservation");
const newReservation = require("./newReservation");
const deleteReservation = require("./deleteReservation");
const editSpace = require("./editSpace");
const deleteSpace = require("./deleteSpace");
const changeStateSpaces=require("./changeStateSpace")

module.exports = {
  getSpace,
  filterSpaces,
  getReservation,
  newSpace,
  newReservation,
  editReservation,
  deleteReservation,
  editSpace,
  deleteSpace,
  changeStateSpaces,
};
