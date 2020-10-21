const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createCard: async (uid, name, description) => {
    const board = await getCollection('cards').insertOne({
      userId: uid,
      name,
      description,
      createdAt: new Date(),
    });
    return board.ops[0];
  },

  removeCard: async (uid, id) => {
    await getCollection('cards').deleteOne({
      userId: ObjectId(uid),
      _id: ObjectId(id),
    });
  },

  updateCard: async (uid, bid, data) => {
    try {
      const board = await getCollection('cards').findAndModify(
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
