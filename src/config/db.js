require('dotenv').config();
const fauna = require('faunadb');

const client = new fauna.Client({ secret: process.env.FAUNA_SECRET_KEY });
module.exports = client;
