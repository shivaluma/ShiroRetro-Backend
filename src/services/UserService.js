const getCollection = require('../utils/getCollection');

module.exports = {
  createUser: async (data) => {
    try {
      const user = await getCollection('users').insertOne(data);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  },
  findOne: async (filter, projection) => {
    try {
      const user = await getCollection('users').findOne(filter, projection);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  },

  updateField: async (filter, update) => {
    try {
      const user = await getCollection('users').findAndModify(filter, update);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  },
};
