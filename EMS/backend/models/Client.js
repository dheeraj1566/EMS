const mongoose = require("mongoose");

// Unified contact sub-document, reused by Client (owner/dealing/accounts officer)
// and Unit (accounts officer/operation department).
const ContactSchema = new mongoose.Schema(
  {
    contactName: { type: String, trim: true },
    designation: { type: String, trim: true },
    landlineWithExtn: { type: String, trim: true },
    mobileNo: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

// Embedded under Unit. client/unit refs are dropped — ownership is implicit via nesting.
const SalaryRateBreakupSchema = new mongoose.Schema(
  {
    shift: String,
    service: String,

    nos: { type: Number, default: 0 },
    monthDays: { type: Number, default: 0 },

    servicePrintName: String,
    remark: String,

    salaryBreakup: {
      basic: { type: Number, default: 0 },
      daVda: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      conveyance: { type: Number, default: 0 },
      washing: { type: Number, default: 0 },
      uniformAllow: { type: Number, default: 0 },
      canteenAllow: { type: Number, default: 0 },
      specialAllow: { type: Number, default: 0 },
      gunAllow: { type: Number, default: 0 },
      exManAllow: { type: Number, default: 0 },
      trainingAllow: { type: Number, default: 0 },
      roomRent: { type: Number, default: 0 },
      medicalAllow: { type: Number, default: 0 },
      leaveAllow: { type: Number, default: 0 },
      bonus: { type: Number, default: 0 },
      gratuity: { type: Number, default: 0 },
      hardshipAllow: { type: Number, default: 0 },
      nh: { type: Number, default: 0 },
      gzhHoliday: { type: Number, default: 0 },
      otherAllowance: { type: Number, default: 0 },
      incentive: { type: Number, default: 0 },
      attendanceAward: { type: Number, default: 0 },
      goodWorkAward: { type: Number, default: 0 },
    },

    totalSalary: { type: Number, default: 0 },

    otHrsRate: { type: Number, default: 0 },
    otRate: { type: Number, default: 0 },
    weeklyOff: { type: Number, default: 0 },
    nightAllow: { type: Number, default: 0 },
    cl0Allow: { type: Number, default: 0 },
    cl1Allow: { type: Number, default: 0 },
    cl2Allow: { type: Number, default: 0 },

    applicable: {
      lwf: { type: Boolean, default: false },
      pt: { type: Boolean, default: false },
      uniformDeduction: { type: Boolean, default: false },
      advanceDeduction: { type: Boolean, default: false },
      esiOnOT: { type: Boolean, default: false },
      esiOnWeeklyOff: { type: Boolean, default: false },
      pfOnOT: { type: Boolean, default: false },
    },

    adminCharges: { type: Number, default: 0 },

    pfPercentage: { type: Number, default: 12 },
    pfAmount: { type: Number, default: 0 },
    esicPercentage: { type: Number, default: 0.75 },
    esicAmount: { type: Number, default: 0 },

    document: String,
  },
  { timestamps: true }
);

// Embedded under Unit. country/state/district/branch/client/unit refs dropped —
// those are inherited from the parent Client/Unit once nested.
const BillRateBreakupSchema = new mongoose.Schema(
  {
    shift: String,
    service: String,

    nos: { type: Number, default: 0 },
    monthDays: { type: Number, default: 0 },

    servicePrintName: String,
    remark: String,

    billBreakup: {
      srNo: { type: Number, default: 0 },

      basic: { type: Number, default: 0 },
      daVda: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      conveyance: { type: Number, default: 0 },
      washing: { type: Number, default: 0 },
      uniformAllow: { type: Number, default: 0 },
      canteenAllow: { type: Number, default: 0 },
      specialAllow: { type: Number, default: 0 },
      gunAllow: { type: Number, default: 0 },
      exManAllow: { type: Number, default: 0 },
      trainingAllow: { type: Number, default: 0 },
      roomRent: { type: Number, default: 0 },
      medicalAllow: { type: Number, default: 0 },
      leaveAllow: { type: Number, default: 0 },
      bonus: { type: Number, default: 0 },
      gratuity: { type: Number, default: 0 },
      hardshipAllow: { type: Number, default: 0 },
      nh: { type: Number, default: 0 },
      gzhHoliday: { type: Number, default: 0 },
      otherAllowance: { type: Number, default: 0 },
      incentive: { type: Number, default: 0 },
      attendanceAward: { type: Number, default: 0 },
      goodWorkAward: { type: Number, default: 0 },

      epf: { type: Number, default: 0 },
      esi: { type: Number, default: 0 },
      lwf: { type: Number, default: 0 },

      relieverAllow: { type: Number, default: 0 },
      extra4Hours: { type: Number, default: 0 },
      esiOnExtra4Hours: { type: Number, default: 0 },
      serviceCharges: { type: Number, default: 0 },
    },

    totalAmount: { type: Number, default: 0 },

    billTerms: {
      epfPercentage: { type: Number, default: 0 },
      epfAmount: { type: Number, default: 0 },
      esiPercentage: { type: Number, default: 0 },
      esiAmount: { type: Number, default: 0 },
      holidayPercentage: { type: Number, default: 0 },
      holidayAmount: { type: Number, default: 0 },
      bonusPercentage: { type: Number, default: 0 },
      bonusAmount: { type: Number, default: 0 },
      serviceChargePercentage: { type: Number, default: 0 },
      serviceChargePerDay: { type: Number, default: 0 },
      relievingChargePercentage: { type: Number, default: 0 },
      lwfAmount: { type: Number, default: 0 },
    },

    isHideAttendance: { type: Boolean, default: false },
    isHideRate: { type: Boolean, default: false },

    document: String,
  },
  { timestamps: true }
);

// Embedded under Client. `client` ref dropped — ownership is implicit via nesting.
const UnitSchema = new mongoose.Schema(
  {
    unitCode: {
      type: String,
      required: true,
      trim: true,
    },
    oldUnitCode: String,

    unitName: {
      type: String,
      required: true,
    },
    printName: String,

    address: String,
    printAddress: String,

    country: { type: String, default: "India" },

    billingToState: String,
    state: String,
    district: String,

    billingGSTIN: String,
    billingFromState: String,
    gstin: String,

    placeOfSupply: String,

    branch: String,
    siteAt: String,
    fieldArea: String,

    pinCode: String,
    phone: String,
    fax: String,
    email: String,

    noOfEmployees: { type: Number, default: 0 },

    workOrderNo: String,
    workOrderDate: Date,
    workStartDate: Date,

    agreementNo: String,
    agreementDate: Date,
    agreementExpiryDate: Date,

    contactName: String,
    designation: String,
    contactPhone: String,
    contactEmail: String,
    landlineWithExtn: String,

    openingAmount: { type: Number, default: 0 },

    zone: String,

    serviceTaxNo: String,
    panCardNo: String,
    tinNo: String,
    tanNo: String,
    roc: String,

    wagesRevision: String,
    renewalLetterSendDate: Date,

    controller: String,
    salaryTransferredBy: String,

    remarkMIS: String,

    isUniformFree: { type: Boolean, default: false },

    clientService: String,

    housekeepingService: { type: Boolean, default: false },
    manpowerService: { type: Boolean, default: false },
    securityServices: { type: Boolean, default: false },

    enclosure: String,

    currentStatus: {
      type: String,
      enum: ["Active", "Terminate"],
      default: "Active",
    },

    workCompletionDate: Date,
    reason: String,

    isTenderUnit: { type: Boolean, default: false },
    isEventUnit: { type: Boolean, default: false },

    executive: String,
    vendorCode: String,

    accountsOfficer: ContactSchema,
    operationDepartment: ContactSchema,

    billType: { type: String, default: "Muster" },
    billGenerateType: { type: String, default: "Invoice" },
    printFormat: { type: String, default: "Std" },

    bank: String,

    billNotCreateForThisUnit: { type: Boolean, default: false },
    gstApplicable: { type: Boolean, default: true },
    igstApplicable: { type: Boolean, default: false },
    unionTerritorySystemBilling: { type: Boolean, default: false },
    isBillingInDecimal: { type: Boolean, default: false },
    contractPeriodShown: { type: Boolean, default: false },

    pfCode: String,
    esicCode: String,

    salaryRateBreakups: [SalaryRateBreakupSchema],
    billRateBreakups: [BillRateBreakupSchema],
  },
  { timestamps: true }
);

const ClientSchema = new mongoose.Schema(
  {
    clientCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    oldClientCode: String,

    zone: String,
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    address: String,
    country: { type: String, default: "India" },

    state: String,
    district: String,
    branch: String,
    area: String,

    pin: String,
    phone: String,
    fax: String,

    email: { type: String, lowercase: true },
    web: String,

    natureOfServices: String,

    currentStatus: {
      type: String,
      enum: ["Active", "Terminate", "Skip"],
      default: "Active",
    },

    clientCategory: String,
    clientVertical: String,

    securityDepositAmount: { type: Number, default: 0 },
    fdrDdBgNoDate: String,

    maturityDate: Date,
    refundDate: Date,

    isCashVan: { type: Boolean, default: false },

    workOrderNo: String,
    workOrderDate: Date,

    agreementNo: String,
    agreementDate: Date,

    contractDate: Date,
    contractExpiredDate: Date,

    ownerInformation: ContactSchema,
    dealingOfficer: ContactSchema,
    accountsOfficer: ContactSchema,

    crm: {
      name: String,
      mobileNo: String,
    },

    units: [UnitSchema],
  },
  { timestamps: true }
);

// Enforce unitCode uniqueness across the whole collection (multikey unique index).
ClientSchema.index({ "units.unitCode": 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Client", ClientSchema);
