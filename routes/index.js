// routes/index.js

const router = require('express').Router();
const usersRouter = require('./user');
const articlesRouter = require('./articles');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
// router.use('/logout', usersRouter);

router.all('*', () => {
  throw new NotFoundError('Такой ресурс не доступен');
});

module.exports = router;
