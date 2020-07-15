// routes/users.js

const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const { getUsers } = require('../controllers/users');

// GET
// usersRouter.get('/me', getUsers);

usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), auth, getUsers);

module.exports = usersRouter;
