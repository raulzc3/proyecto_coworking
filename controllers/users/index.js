//const filterUsers = require("./filterUsers");
const addUser = require("./addUser");
const validateUser = require("./validateUser");
const loginUser = require("./loginUser");
const getUser = require("./getUser");
const deleteUser = require("./deleteUser");
const editUser = require("./editUser");
const editUserForAdmin = require("./editUserForAdmin");

module.exports = {
  addUser,
  validateUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  editUserForAdmin,
};
