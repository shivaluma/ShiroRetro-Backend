const { ResponseService, CardService } = require('../services');

exports.postCard = async (req, res) => {
  const { user } = req;
  const { name, description, lastPos, idList, idBoard } = req.body;
  try {
    const card = await CardService.createCard(
      idList,
      idBoard,
      name,
      description,
      lastPos,
      user._id
    );

    return res
      .status(201)
      .json(ResponseService.response(201, 'Create card successful.', card));
  } catch (err) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Bad Request.', err));
  }
};

exports.getCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await CardService.findCard(id);

    return res.status(200).json(ResponseService.response(200, null, card));
  } catch (err) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Bad Request.', err));
  }
};

// exports.putCard = (req, res) => {};

// exports.deleteCard = (req, res) => {};
