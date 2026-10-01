const authController = require("./authController");
const profileController = require("./profileController");
const staffController = require("./staffController");

module.exports = {
  ...authController,
  ...profileController,
  ...staffController
};
