const express = require("express");
const {
  createReportClient,
  getReportClients,
  getReportClient,
  updateReportClient,
  deleteReportClient,
} = require("../controllers/reportClientController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getReportClients).post(createReportClient);

router
  .route("/:id")
  .get(getReportClient)
  .patch(updateReportClient)
  .delete(deleteReportClient);

module.exports = router;
