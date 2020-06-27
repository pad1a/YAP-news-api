const isURL = require('validator/lib/isURL');
const BadReqError = require('../errors/bad-req-err');

module.exports.urlValidate = (v) => {
  const link = isURL(v);
  if (link !== true) {
    throw new BadReqError('Формат ссылки не верный');
  } else return v;
};
