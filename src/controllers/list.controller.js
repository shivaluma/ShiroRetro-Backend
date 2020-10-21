const { ResponseService, ListService } = require('../services');

exports.postList = async (req, res) => {
  const { name, idBoard } = req.body;

  if (!name || !idBoard) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Missing required field.'));
  }

  try {
    const list = await ListService.createList(idBoard, name);
    return res
      .status(201)
      .json(ResponseService.response(201, 'Create board successfully.', list));
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Some unexpected error occurred.', err));
  }
};

exports.getList = async (req, res) => {
  const { id } = req.params;
  try {
    const list = await ListService.getList(id);
    return res.status(200).json(ResponseService.response(200, null, list));
  } catch (err) {
    return res
      .status(200)
      .json(ResponseService.response(500, 'Unexpected error occurred', err));
  }
};
