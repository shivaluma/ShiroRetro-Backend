const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getBoards: async (uid) => {
    const board = await getCollection('boards').find({
      userId: ObjectId(uid),
    });
    return board;
  },

  getBoard: async (idBoard) => {
    const board = await getCollection('boards').findOne({
      _id: ObjectId(idBoard),
    });
    return board;
  },
  createBoard: async (uid, name, description) => {
    const board = await getCollection('boards').insertOne({
      userId: uid,
      name,
      description,
      createdAt: new Date(),
    });
    return board.ops[0];
  },

  removeBoard: async (uid, id) => {
    await getCollection('boards').deleteOne({
      userId: ObjectId(uid),
      _id: ObjectId(id),
    });
  },

  updateBoard: async (uid, bid, data) => {
    try {
      const board = await getCollection('boards').findAndModify(
        {
          _id: ObjectId(bid),
          userId: ObjectId(uid),
        },
        data
      );
      return board;
    } catch (err) {
      throw new Error(err);
    }
  },
};
