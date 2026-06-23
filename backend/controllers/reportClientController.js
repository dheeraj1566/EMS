const ReportClient = require("../models/ReportClient");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createReportClient = catchAsync(async (req, res, next) => {
  const report = await ReportClient.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: report });
});

exports.getReportClients = catchAsync(async (req, res, next) => {
  const reports = await ReportClient.find().populate("createdBy", "name email");

  res.status(200).json({ success: true, count: reports.length, data: reports });
});

exports.getReportClient = catchAsync(async (req, res, next) => {
  const report = await ReportClient.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!report) {
    return next(new AppError("Report not found.", 404));
  }

  res.status(200).json({ success: true, data: report });
});

exports.updateReportClient = catchAsync(async (req, res, next) => {
  const report = await ReportClient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!report) {
    return next(new AppError("Report not found.", 404));
  }

  res.status(200).json({ success: true, data: report });
});

exports.deleteReportClient = catchAsync(async (req, res, next) => {
  const report = await ReportClient.findByIdAndDelete(req.params.id);

  if (!report) {
    return next(new AppError("Report not found.", 404));
  }

  res.status(204).json({ success: true, data: null });
});
