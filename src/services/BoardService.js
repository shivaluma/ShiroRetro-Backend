const { ObjectId } = require('mongodb');
const shortid = require('shortid');
const getCollection = require('../utils/getCollection');

module.exports = {
  getBoards: async (uid) => {
    const boards = await getCollection('boards')
      .find({
        userId: ObjectId(uid),
      })
      .toArray();

    return boards;
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
      shortId: shortid.generate(),
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
      const board = await getCollection('boards').findOneAndUpdate(
        {
          _id: ObjectId(bid),
          userId: ObjectId(uid),
        },

        {
          $set: { name: data.name, description: data.description },
        }
      );
      return board;
    } catch (err) {
      throw new Error(err);
    }
  },
};
