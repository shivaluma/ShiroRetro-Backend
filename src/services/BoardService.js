const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
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
};
