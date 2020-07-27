const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors')
require('dotenv').config();
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const routes = require('./routes');
const { signInRouter, signUpRouter, signOutRouter } = require('./routes/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ErrorMiddleware } = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

const corsOptions = {
  origin:['https://0911.ru', 'http://localhost:8080', 'https://pad1a.github.io/YAP-news-front', 'https://pad1a.github.io'],
  credentials: true,
};


app.use(cors(corsOptions));
/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
*/
mongoose.connect('mongodb://localhost:27017/yapdiplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(limiter);
app.use(helmet());
app.use(requestLogger);

app.use('/', signUpRouter);
app.use('/', signInRouter);
app.use('/', signOutRouter);

// защитили все роуты кроме создания юзера и логина
app.use(auth);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(ErrorMiddleware);

app.listen(PORT, () => {
});
