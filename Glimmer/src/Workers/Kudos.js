import Moment from 'moment';
import {addKudosBatch} from '../Redux/actions';

export default class Kudos {

  /**
   * Get info on a user, either username or id
   * @param user
   * @returns {Promise}
   */
  async getKudos(page) {
    console.log("getting kudos page", page);
    const url = `/kudos/received?page=${page}`;
    const kudos = await api.makeApiGetCall(url);
    const kudi = kudos.data.map(k => parseKudos(k));
    store.dispatch(addKudosBatch(kudi));
    return true;
  }

}

function parseKudos(data) {

  const uniqueId = `${data.subject.id}_${data.creator.id}`;

  return {
    uniqueId,
    createdAt: new Moment(data.created_at),
    creatorId: data.creator.id,
    creatorName: data.creator.name,
    creatorImage: data.creator.image_url,
    subjectId: data.subject.id,
    subjectLabel: data.subject.label,
    subjectType: data.subject.type,
    subjectUrl: data.subject.url,
  }
}
