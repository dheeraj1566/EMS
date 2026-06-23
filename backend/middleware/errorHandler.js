const AppError = require("../utils/AppError");

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join(". "), 400);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate value for field "${field}": ${err.keyValue[field]}`,
    409
  );
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again.", 401);

module.exports = (err, req, res, next) => {
  let error = err;

  if (error.name === "CastError") error = handleCastError(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
  if (error.code === 11000) error = handleDuplicateKeyError(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Something went wrong";

  if (!error.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
