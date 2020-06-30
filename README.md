# YAP-news-api
YAP diplom back v.0.1.0

### Адрес api:
#### https://api.0911.ru

### Описание:
#### Cоздать пользователя {email, password, name}
##### POST /signup

#### Авторизация {email, password}
##### POST /signin

#### Возвращает информацию текущему пользователю (name, email)
##### GET /users/me

#### Возвращает все сохранённые текущим пользователем статьи
##### GET /articles

#### Cоздаёт статью {keyword, title, text, date, source, link и image}
##### POST /articles

#### Удаляет сохранённую статью по _id
##### DELETE /articles/articleId
