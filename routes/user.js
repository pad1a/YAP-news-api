// routes/users.js

const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/users');

// GET
usersRouter.get('/me', getUsers);

module.exports = usersRouter;
