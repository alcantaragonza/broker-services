const { error } = require('../utils/responses');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return error(res, 'Datos de entrada inválidos', 400, errors);
  }
  req.body = result.data;
  next();
};

module.exports = validate;