const argon2 = require('argon2');
const db = require('../config/db');
const { ResponseService } = require('../services');

exports.getMe = async (req, res) => {
  return res.status(200).json(ResponseService.response(200, null, req.user));
};

exports.changePassword = async (req, res) => {
  const { password, newPassword, newPasswordConfirm } = req.body;
  const { user } = req;
  const isPasswordMatch = await argon2.verify(user.password, password);

  if (!isPasswordMatch) {
    res
      .status(400)
      .json(ResponseService.error(400, 'Old password does not match', null));
  }

  if (newPassword !== newPasswordConfirm) {
    res
      .status(400)
      .json(ResponseService.error(400, 'New passwords do not match', null));
  }

  const newPasswordHashed = await argon2.hash(newPassword);

  db.getDb()
    .db()
    .collection('users')
    .findAndModify({
      query: {
        id: user.id,
      },
      update: { password: newPasswordHashed },
    });

  return res
    .status(403)
    .json(ResponseService.error(403, 'Non Authorization', null));
};
