// Shared filter shape for unit reports. Not a standalone model — embed this
// object into whichever schema/request validator needs a unit-report filter.
const reportUnitFilterSchema = {
  country: String,
  state: String,
  district: String,
  branch: String,
  fieldArea: String,

  client: String,

  agreementDateFrom: Date,
  agreementDateTo: Date,

  agreementExpiryDateFrom: Date,
  agreementExpiryDateTo: Date,

  insertDateFrom: Date,
  insertDateTo: Date,

  status: String, // Active, Terminate

  unhide: {
    type: Boolean,
    default: false,
  },
};

module.exports = reportUnitFilterSchema;
