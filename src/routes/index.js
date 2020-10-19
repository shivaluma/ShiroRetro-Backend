const client = require('../config/db');
const { Get, Match, Index } = require('faunadb').query;
// main router
const router = require('express').Router();

router.get('/', async (req, res) => {
  res.send(client.query(Get(Match(Index('users_by_username'), 'shivaluma'))));
});

module.exports = router;
