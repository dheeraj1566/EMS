const express = require("express");
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  getUnits,
  getUnit,
  addUnit,
  updateUnit,
  deleteUnit,
  addSalaryRateBreakup,
  updateSalaryRateBreakup,
  deleteSalaryRateBreakup,
  addBillRateBreakup,
  updateBillRateBreakup,
  deleteBillRateBreakup,
} = require("../controllers/clientController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getClients).post(createClient);

router
  .route("/:clientId")
  .get(getClient)
  .patch(updateClient)
  .delete(deleteClient);

router.route("/:clientId/units").get(getUnits).post(addUnit);

router
  .route("/:clientId/units/:unitId")
  .get(getUnit)
  .patch(updateUnit)
  .delete(deleteUnit);

router
  .route("/:clientId/units/:unitId/salary-rates")
  .post(addSalaryRateBreakup);

router
  .route("/:clientId/units/:unitId/salary-rates/:rateId")
  .patch(updateSalaryRateBreakup)
  .delete(deleteSalaryRateBreakup);

router.route("/:clientId/units/:unitId/bill-rates").post(addBillRateBreakup);

router
  .route("/:clientId/units/:unitId/bill-rates/:rateId")
  .patch(updateBillRateBreakup)
  .delete(deleteBillRateBreakup);

module.exports = router;
