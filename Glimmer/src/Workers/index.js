/**
 * Created by kvasbo on 31.05.2017.
 */
import ForumUpdater from './ForumUpdater';
import ForumListUpdater from './ForumListUpdater';
import KretsUpdater from './KretsUpdater';
import UserUpdater from './UserUpdater';
import MessageUpdater from './MessageUpdater';
import ImageGetter from './ImageGetter';
import ForumGetter from './ForumGetter';
import Kudos from './Kudos';
import Gjemsel from './Gjemsel';
import Settings from './Settings';
import EventUpdater from './EventUpdater';

export default class Workers {
  constructor() {
    this.forumUpdater = new ForumUpdater();
    this.forumListUpdater = new ForumListUpdater();
    this.kretsUpdater = new KretsUpdater();
    this.userUpdater = new UserUpdater();
    this.messageUpdater = new MessageUpdater();
    this.imageGetter = new ImageGetter();
    this.forumGetter = new ForumGetter();
    this.kudos = new Kudos();
    this.gjemsel = new Gjemsel();
    this.settings = new Settings();
    this.eventUpdater = new EventUpdater();
  }

  initData() {

    console.log("Initdata");

    const first = [this.forumUpdater.loadFirstFavorites(4), this.forumUpdater.loadFirstStream(1), this.messageUpdater.updateMessageThreads(1)];

    Promise.all(first).then(() => {
      this.kretsUpdater.initKrets();
      this.forumListUpdater.reloadForums(false);
      this.forumUpdater.loadFirstUnread(1);
      this.kudos.getKudos(1);
      // this.kudos.getKudos(2);
      // this.kudos.getKudos(3);
    });
  }

  refreshAppData() {
    console.log("refreshAppData");
    this.refreshForumData();
    this.kudos.getKudos(1);
    this.messageUpdater.updateMessageThreads(1);
  }

  refreshForumData() {
    console.log("refreshForumData");
    this.forumUpdater.loadFirstFavorites(4);
    this.forumUpdater.loadFirstStream(1);
  }
}
