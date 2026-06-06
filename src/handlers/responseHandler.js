const sendSuccess = (res, statusCode, mensaje, data = null) => {
  const payload = {
    success: true,
    mensaje
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode, mensaje, error = null) => {
  const payload = {
    success: false,
    mensaje
  };

  if (error !== null && error !== undefined) {
    payload.error = error;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError
};
