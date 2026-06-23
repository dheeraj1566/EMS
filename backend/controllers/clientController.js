const Client = require("../models/Client");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const buildSet = (prefix, body) => {
  const set = {};
  Object.keys(body).forEach((key) => {
    set[`${prefix}.${key}`] = body[key];
  });
  return set;
};

const findUnit = (client, unitId) => {
  const unit = client.units.find((u) => u._id.toString() === unitId);
  return unit;
};

// ---- Client ----

exports.createClient = catchAsync(async (req, res, next) => {
  const client = await Client.create(req.body);
  res.status(201).json({ success: true, data: client });
});

exports.getClients = catchAsync(async (req, res, next) => {
  const { currentStatus, zone, clientCategory, clientVertical } = req.query;
  const filter = {};
  if (currentStatus) filter.currentStatus = currentStatus;
  if (zone) filter.zone = zone;
  if (clientCategory) filter.clientCategory = clientCategory;
  if (clientVertical) filter.clientVertical = clientVertical;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  const [clients, total] = await Promise.all([
    Client.find(filter)
      .skip((page - 1) * limit)
      .limit(limit),
    Client.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, count: clients.length, total, page, data: clients });
});

exports.getClient = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.clientId);
  if (!client) return next(new AppError("Client not found.", 404));
  res.status(200).json({ success: true, data: client });
});

exports.updateClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndUpdate(req.params.clientId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!client) return next(new AppError("Client not found.", 404));
  res.status(200).json({ success: true, data: client });
});

exports.deleteClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.clientId);
  if (!client) return next(new AppError("Client not found.", 404));
  res.status(204).json({ success: true, data: null });
});

// ---- Units (embedded in Client) ----

exports.getUnits = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.clientId).select("units");
  if (!client) return next(new AppError("Client not found.", 404));
  res.status(200).json({ success: true, count: client.units.length, data: client.units });
});

exports.getUnit = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.clientId).select("units");
  if (!client) return next(new AppError("Client not found.", 404));

  const unit = findUnit(client, req.params.unitId);
  if (!unit) return next(new AppError("Unit not found.", 404));

  res.status(200).json({ success: true, data: unit });
});

exports.addUnit = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndUpdate(
    req.params.clientId,
    { $push: { units: req.body } },
    { new: true, runValidators: true }
  );
  if (!client) return next(new AppError("Client not found.", 404));

  const unit = client.units[client.units.length - 1];
  res.status(201).json({ success: true, data: unit });
});

exports.updateUnit = catchAsync(async (req, res, next) => {
  const { clientId, unitId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $set: buildSet("units.$", req.body) },
    { new: true, runValidators: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  res.status(200).json({ success: true, data: findUnit(client, unitId) });
});

exports.deleteUnit = catchAsync(async (req, res, next) => {
  const { clientId, unitId } = req.params;

  const client = await Client.findByIdAndUpdate(
    clientId,
    { $pull: { units: { _id: unitId } } },
    { new: true }
  );
  if (!client) return next(new AppError("Client not found.", 404));

  res.status(204).json({ success: true, data: null });
});

// ---- Salary Rate Breakups (embedded in Unit) ----

exports.addSalaryRateBreakup = catchAsync(async (req, res, next) => {
  const { clientId, unitId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $push: { "units.$.salaryRateBreakups": req.body } },
    { new: true, runValidators: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  const unit = findUnit(client, unitId);
  const rate = unit.salaryRateBreakups[unit.salaryRateBreakups.length - 1];
  res.status(201).json({ success: true, data: rate });
});

exports.updateSalaryRateBreakup = catchAsync(async (req, res, next) => {
  const { clientId, unitId, rateId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $set: buildSet("units.$.salaryRateBreakups.$[rate]", req.body) },
    { arrayFilters: [{ "rate._id": rateId }], new: true, runValidators: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  const unit = findUnit(client, unitId);
  const rate = unit.salaryRateBreakups.find((r) => r._id.toString() === rateId);
  if (!rate) return next(new AppError("Salary rate breakup not found.", 404));

  res.status(200).json({ success: true, data: rate });
});

exports.deleteSalaryRateBreakup = catchAsync(async (req, res, next) => {
  const { clientId, unitId, rateId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $pull: { "units.$.salaryRateBreakups": { _id: rateId } } },
    { new: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  res.status(204).json({ success: true, data: null });
});

// ---- Bill Rate Breakups (embedded in Unit) ----

exports.addBillRateBreakup = catchAsync(async (req, res, next) => {
  const { clientId, unitId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $push: { "units.$.billRateBreakups": req.body } },
    { new: true, runValidators: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  const unit = findUnit(client, unitId);
  const rate = unit.billRateBreakups[unit.billRateBreakups.length - 1];
  res.status(201).json({ success: true, data: rate });
});

exports.updateBillRateBreakup = catchAsync(async (req, res, next) => {
  const { clientId, unitId, rateId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $set: buildSet("units.$.billRateBreakups.$[rate]", req.body) },
    { arrayFilters: [{ "rate._id": rateId }], new: true, runValidators: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  const unit = findUnit(client, unitId);
  const rate = unit.billRateBreakups.find((r) => r._id.toString() === rateId);
  if (!rate) return next(new AppError("Bill rate breakup not found.", 404));

  res.status(200).json({ success: true, data: rate });
});

exports.deleteBillRateBreakup = catchAsync(async (req, res, next) => {
  const { clientId, unitId, rateId } = req.params;

  const client = await Client.findOneAndUpdate(
    { _id: clientId, "units._id": unitId },
    { $pull: { "units.$.billRateBreakups": { _id: rateId } } },
    { new: true }
  );
  if (!client) return next(new AppError("Client or unit not found.", 404));

  res.status(204).json({ success: true, data: null });
});
