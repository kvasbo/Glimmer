export default class EventUpdater {
  async getAllParticipantsForEvent(eventId) {
    const data = this.doGetParticipantsForEvent(eventId, 1);
    return data.data;
  }

  async doGetParticipantsForEvent(eventId, page) {
    const outData = [];
    let nextPage = page;
    while (true) {
      const data = await api.makeApiGetCall(`/events/${eventId}/participations?page=${nextPage}`);
      outData.concat(data.data);
      nextPage += 1;
      if (data.data.length !== 30 || nextPage > 100) break;
    }
    // const data = await api.makeApiGetCall(`/events/${eventId}/participations?page=${page}`);
    console.log(outData);
    return data.data;
  }
}
