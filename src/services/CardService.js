const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createCard: async (idList, idBoard, name, desc, prevPos, uid) => {
    const newDate = new Date();
    const card = await getCollection('cards').insertOne({
      idList,
      idBoard,
      name,
      desc,
      createdAt: newDate,
      updatedAt: newDate,
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
    const newDate = new Date();
    try {
      const card = await getCollection('cards').update(
        {
          _id: ObjectId(bid),
        },
        {
          ...data,
          updatedAt: newDate,
        }
      );
      return card;
    } catch (err) {
      throw new Error(err);
    }
  },
};
