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
  }

  initData() {
    const first = [this.forumUpdater.loadFirstFavorites(1), this.forumUpdater.loadFirstStream(1), this.messageUpdater.updateMessageThreads(1)];

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
    this.refreshForumData();
    this.kudos.getKudos(1);
    this.messageUpdater.updateMessageThreads(1);
  }

  refreshForumData() {
    this.forumUpdater.loadFirstFavorites(1);
    this.forumUpdater.loadFirstStream(1);
  }
}
