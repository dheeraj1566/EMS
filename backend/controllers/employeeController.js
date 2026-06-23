const Employee = require("../models/Employee");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// Create Employee
exports.createEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, data: employee });
});

// Get list of employees with simple pagination and optional status filter
exports.getEmployees = catchAsync(async (req, res, next) => {
  const { currentStatus } = req.query;
  const filter = {};
  if (currentStatus) filter.currentStatus = currentStatus;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  const [employees, total] = await Promise.all([
    Employee.find(filter).skip((page - 1) * limit).limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, count: employees.length, total, page, data: employees });
});

// Get single employee
exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return next(new AppError("Employee not found.", 404));
  res.status(200).json({ success: true, data: employee });
});

// Update employee
exports.updateEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employee) return next(new AppError("Employee not found.", 404));
  res.status(200).json({ success: true, data: employee });
});

// Delete employee
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return next(new AppError("Employee not found.", 404));
  res.status(204).json({ success: true, data: null });
});
