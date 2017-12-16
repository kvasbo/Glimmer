import { addUserBatch } from '../Redux/actions';

const User = require('../DataClasses/user').default;
const CacheUser = require('../DataClasses/cacheUser').default;

export default class UserUpdater {
  /**
     * Get info on a user, either username or id
     * @param user
     * @returns {Promise}
     */
  async getUserInfo(user) {
    const data = await api.makeApiGetCall(`/users/${user}`);
    const tmpUser = new User(data.data.id, data.data.name, data.data.realname, data.data.image_url, data.data.friend);
    const cacheToStore = new CacheUser(data.data.id, data.data.name, data.data.realname, data.data.image_url);
    store.dispatch(addUserBatch([tmpUser]));
    return tmpUser;
  }

  async getUserRawData(user) {
    const data = await api.makeApiGetCall(`/users/${user}`);
    return data.data;
  }
}
