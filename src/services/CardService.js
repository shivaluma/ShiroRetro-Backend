const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createCard: async (idList, idBoard, name, desc, prevPos, uid) => {
    const card = await getCollection('cards').insertOne({
      idList,
      name,
      desc,
      createdAt: new Date(),
      pos: prevPos + 65535,
      userId: ObjectId(uid),
    });
    return card.ops[0];
  },
  findCard: async (idCard) => {
    const card = await getCollection('cards').insertOne({
      _id: ObjectId(idCard),
    });
    return card.ops[0];
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
