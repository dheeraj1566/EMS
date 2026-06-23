const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getEmployees).post(createEmployee);

router.route("/:id").get(getEmployee).patch(updateEmployee).delete(deleteEmployee);

module.exports = router;
