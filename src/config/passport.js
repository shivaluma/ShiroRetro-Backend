require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { ResponseService } = require('../services');
const db = require('./db');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.getDb()
        .db()
        .collection('users')
        .findOne({ id: jwt_payload.id }, { fields: { password: 0 } })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(
            null,
            false,
            ResponseService.error(404, 'Invalid Token Provided')
          );
        })
        .catch((err) =>
          done(
            null,
            false,
            ResponseService.error(404, 'Internal Server Error', err)
          )
        );
    })
  );
};
