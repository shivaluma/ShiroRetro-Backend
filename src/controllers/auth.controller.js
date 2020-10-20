require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const got = require('got');
const { v4: uuidv4 } = require('uuid');
const { ResponseService, UserService } = require('../services');
const db = require('../config/db');
const getCollection = require('../utils/getCollection');

exports.postSignUp = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;
  if (!username || !password || !email || !confirmPassword) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Please provide all necessary data.'));
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const data = {
      username,
      password: hashedPassword,
      displayName: username,
      email,
    };
    try {
      await UserService.createUser(data);
      return res
        .status(201)
        .json(
          ResponseService.response(201, 'Create account successfully.', null)
        );
    } catch (err) {
      return res
        .status(400)
        .json(ResponseService.error(400, 'Username/Email exist.', err));
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
    const user = await UserService.findOne({ username });
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

    const user = await UserService.findOne({
      $or: [{ 'socials.googleId': response.sub }, { email: response.email }],
    });

    if (user) {
      if (user.socials && user.socials.googleId === response.sub) {
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
      }

      return res
        .status(400)
        .json(
          ResponseService.response(
            400,
            'There is an account with this email address, if you own the account, please login and then bind to this google account.'
          )
        );
    }

    const socialPending = await getCollection('socials').findOne({
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
    await getCollection('socials').insertOne({
      createdAt: new Date(),
      provider: 'google',
      providerId: response.sub,
      email: response.email,
      token: createAccountToken,
    });
    return res.status(203).json(
      ResponseService.response(203, 'Please update username.', {
        token: createAccountToken,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Internal Server Error', err));
  }
};

exports.getValidField = async (req, res) => {
  const { value, field } = req.query;
  if (!value || !field) {
    return res
      .status(400)
      .json(ResponseService.response(400, `field or value is missing.`));
  }
  const user = await UserService.findOne({ [field]: value });
  if (!user) {
    return res.status(200).json(
      ResponseService.response(200, `${field} *${value}* is available.`, {
        isFree: true,
      })
    );
  }

  return res.status(200).json(
    ResponseService.response(200, `${field} *${value}* is not available.`, {
      isFree: false,
    })
  );
};

exports.postFacebookSignin = async (req, res) => {
  const { id, fbAccessToken } = req.body;
  if (!fbAccessToken) {
    return res
      .status(404)
      .json(
        ResponseService.error(404, 'Cannot found the facebook access token.')
      );
  }
  try {
    const query = `https://graph.facebook.com/${id}?fields=birthday,email,picture&access_token=${fbAccessToken}`;
    const response = await got(`${query}`).json();

    const user = await UserService.findOne({
      $or: [{ 'socials.facebookId': response.id }, { email: response.email }],
    });

    if (user) {
      const payload = ResponseService.userPayload(
        user.username,
        user.displayName,
        user.email
      );
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
      return res.status(200).json(
        ResponseService.response(200, 'Login Successfully.', {
          accessToken,
          user: payload,
        })
      );
    }

    const socialPending = await getCollection('socials').findOne({
      provider: 'facebook',
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
    await getCollection('socials').insertOne({
      createdAt: new Date(),
      provider: 'facebook',
      providerId: response.id,
      email: response.email,
      token: createAccountToken,
    });
    return res.status(203).json(
      ResponseService.response(203, 'Please update username.', {
        token: createAccountToken,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Internal Server Error', err));
  }
};
