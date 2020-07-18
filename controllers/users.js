// controllers/users.js
// это файл контроллеров
const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadReqError = require('../errors/bad-req-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');

/* const getUsers = (req, res, next) => {
  User.find({})
    .populate('user')
    .then((user) => res.send({ data: user }))
    .catch(next);
};
*/

const getUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadReqError('Неверный запрос');
      }
      if (err.errors.email.kind === 'unique') {
        throw new ConflictError('Такой E-mail уже используется');
      }
    })
    .catch(next);
};

/* const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByEmail(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          // sameSite: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userlogin = await User.findUserByEmail(email, password);
    const token = jwt.sign({ _id: userlogin._id }, JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      // domain: 'https://api.0911.ru',
    });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUsers, createUser, login,
};
