import Moment from 'moment';

export default class Kudos {

  /**
   * Get info on a user, either username or id
   * @param user
   * @returns {Promise}
   */
  async getKudos(page) {
    console.log("getting kudos page", 1);
    const url = '/kudos/received';
    const kudos = await api.makeApiGetCall(url);

    const kudi = kudos.data.map(k => parseKudos(k));

    console.log("kudos", kudos, kudi);
  }

}

function parseKudos(data) {
  return {
    created: new Moment(data.created_at),
    creatorId: data.creator.id,
    creatorName: data.creator.name,
    creatorImage: data.creator.image_url,
    subjectId: data.subject.id,
    subjectLabel: data.subject.label,
    subjectType: data.subject.type,
    subjectUrl: data.subject.url,
  }
}
