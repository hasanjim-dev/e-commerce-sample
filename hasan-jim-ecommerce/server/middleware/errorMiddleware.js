const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found — ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 400;
    message = "A record with these details already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
