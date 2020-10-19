require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const got = require('got');
const { v4: uuidv4 } = require('uuid');
const { ResponseService } = require('../services');
const db = require('../config/db');

exports.postSignUp = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'No username/password was provided.'));
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const data = {
      username,
      password: hashedPassword,
      displayName: username,
    };
    try {
      await db.getDb().db().collection('users').insertOne(data);
      return res
        .status(201)
        .json(
          ResponseService.response(201, 'Create account successfully.', null)
        );
    } catch (err) {
      return res
        .status(400)
        .json(ResponseService.error(400, 'Username exist.', err));
    }
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Server error.', err));
  }
};

exports.postSignIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'No username/password was provided.'));
  }

  try {
    const user = await db
      .getDb()
      .db()
      .collection('users')
      .findOne({ username });
    req.log.info(user);
    if (!user)
      return res
        .status(404)
        .json(
          ResponseService.error(
            404,
            'Cannot find account with this username.',
            null
          )
        );

    const isSamePassword = await argon2.verify(user.password, password);

    if (!isSamePassword) {
      return res
        .status(400)
        .json(ResponseService.error(400, 'Wrong username or password.', null));
    }

    const payload = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: payload,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Server error.', err));
  }
};

exports.postGoogleSignIn = async (req, res) => {
  const { ggAccessToken } = req.body;
  if (!ggAccessToken) {
    return res
      .status(404)
      .json(
        ResponseService.error(404, 'Cannot found the google access token.')
      );
  }
  try {
    const query = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${ggAccessToken}`;
    const response = await got(`${query}`).json();

    const user = await db
      .getDb()
      .db()
      .collection('users')
      .findOne({ 'socials.googleId': response.sub });

    if (user) {
      const payload = {
        id: user.id,
        username: user.username,
      };
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
      return res.status(200).json(
        ResponseService.response(200, 'Login Successfully.', {
          accessToken,
          user: payload,
        })
      );
    }

    const socialPending = await db.getDb().db().collection('socials').findOne({
      provider: 'google',
      providerId: response.sub,
    });

    if (socialPending) {
      return res.status(203).json(
        ResponseService.response(203, 'Please update username.', {
          token: socialPending.token,
        })
      );
    }

    const createAccountToken = uuidv4();
    const data = await db.getDb().db().collection('socials').insertOne({
      provider: 'google',
      providerId: response.sub,
      token: createAccountToken,
    });
    return res.status(203).json(
      ResponseService.response(203, 'Please update username.', {
        token: data,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Internal Server Error', err));
  }
};
