const success = (res, data, statusCode = 200, message = null) => {
  const payload = { success: true };
  if (message) payload.message = message;
  if (data !== undefined && data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const error = (res, message, statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { success, error };