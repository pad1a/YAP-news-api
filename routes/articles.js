// routes/cards.js
const articlesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { urlValidate } = require('../middlewares/isURL');

const {
  getArticles, createArticles, deleteArticles,
} = require('../controllers/articles');

// GET возвращает все сохраненные пользователем статьи
articlesRouter.get('/', getArticles);

// POST
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(urlValidate, 'urlValidator').required(),
    image: Joi.string().custom(urlValidate, 'urlValidator').required(),
  }),
}), createArticles);

// DEL
articlesRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), deleteArticles);

module.exports = articlesRouter;
