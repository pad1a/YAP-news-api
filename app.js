const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const express = require('express');
require('dotenv').config();
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const routes = require('./routes');
const { signInRouter, signUpRouter } = require('./routes/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ErrorMiddleware } = require('./middlewares/error');

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
app.use('/', signUpRouter);
app.use('/', signInRouter);
// защитили все роуты кроме создания юзера и логина
app.use(auth);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(ErrorMiddleware);

app.listen(PORT, () => {
});
