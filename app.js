const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const routes = require('./routes/routes.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ErrorMiddleware } = require('./middlewares/error');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/yapdiplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// защитили все роуты кроме создания юзера и логина
app.use(auth);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(ErrorMiddleware);

// слушаем сервер при каждом обращении
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
