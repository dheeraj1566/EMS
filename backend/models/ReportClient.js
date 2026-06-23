const mongoose = require("mongoose");

const ReportClientSchema = new mongoose.Schema(
  {
    reportName: String,
    country: String,
    state: String,
    district: String,
    branch: String,
    fieldArea: String,
    clientCategory: String,
    clientVertical: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportClient", ReportClientSchema);
