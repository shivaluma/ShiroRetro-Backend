const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getList: async (idList) => {
    const list = await getCollection('lists').find({
      _id: ObjectId(idList),
    });
    return list;
  },

  createList: async (idBoard, name) => {
    const list = await getCollection('list').insertOne({
      name,
      idBoard,
      createdAt: new Date(),
    });
    return list.ops[0];
  },
};
