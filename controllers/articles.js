// controllers/articles.js
// это файл контроллеров

const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForBidError = require('../errors/for-bid-err');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      res.send({ data: articles });
    })
    .catch(next);
};

const createArticles = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.status(200).send({ data: article });
    })
    .catch(next);
};

const deleteArticles = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
  // eslint-disable-next-line consistent-return
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Нет новости с таким id');
      } if (article.owner._id.toString() === req.user._id) {
        return article.remove(req.params.articleId).then(() => res.status(200).send({ message: 'Новость удалена' }));
      } throw new ForBidError('Недостаточно прав');
    })
    .catch(next);
};

module.exports = {
  getArticles, createArticles, deleteArticles,
};
