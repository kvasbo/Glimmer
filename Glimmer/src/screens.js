import { Navigation } from 'react-native-navigation';

import PageSplashScreen from './Components/PageSplashScreen';
import PageStream from './Components/PageStream';
import PageFavorites from './Components/PageFavorites';
import PageUnread from './Components/PageUnread';
import PageThread from './Components/PageThread';
import PageMessages from './Components/PageMessages';
import PageConversation from './Components/PageConversation';
import PageNewForumComment from './Components/PageForumCommentNew';
import PageKretsVelger from './Components/PageKretsVelgerNewMessage';
import PageNewMessage from './Components/PageNewMessage';
import PageNewForumPost from './Components/PageNewForumPost';
import PageForumCommentEdit from './Components/PageForumCommentEdit';
import PageKudos from './Components/PageKudos';
import PageAnnet from './Components/PageAnnet';
import PageSettings from './Components/PageSettings';
import PageGjemsel from './Components/PageGjemsel';
import PageAbout from './Components/PageAbout';
import PageFirst from './Components/PageFirst';
import PageUserProfile from './Components/PageUserProfile';
import PageStart from './Components/PageStart';

import PageLogin from './Components/PageLogin';
import PageForumList from './Components/PageForumList';

import PersonPopup from './Components/UXElements/PersonPopup';
import PopupEmbedViewer from './Components/UXElements/PopupEmbedViewer';

export default function registerScreens(store, Provider) {
  return new Promise((resolve, reject) => {
    try {
      // Proper pages
      Navigation.registerComponent('glimmer.PageSplashScreen', () => PageSplashScreen, store, Provider);
      Navigation.registerComponent('glimmer.PageStream', () => PageStream, store, Provider);
      Navigation.registerComponent('glimmer.PageFavorites', () => PageFavorites, store, Provider);
      Navigation.registerComponent('glimmer.PageUnread', () => PageUnread, store, Provider);
      Navigation.registerComponent('glimmer.PageThread', () => PageThread, store, Provider);
      Navigation.registerComponent('glimmer.PageMessages', () => PageMessages, store, Provider);
      Navigation.registerComponent('glimmer.PageConversation', () => PageConversation, store, Provider);
      Navigation.registerComponent('glimmer.PageNewMessage', () => PageNewMessage, store, Provider);
      Navigation.registerComponent('glimmer.PageNewForumComment', () => PageNewForumComment, store, Provider);
      Navigation.registerComponent('glimmer.PageForumList', () => PageForumList, store, Provider);
      Navigation.registerComponent('glimmer.PageNewForumPost', () => PageNewForumPost, store, Provider);
      Navigation.registerComponent('glimmer.PageKudos', () => PageKudos, store, Provider);
      Navigation.registerComponent('glimmer.PageForumCommentEdit', () => PageForumCommentEdit, store, Provider);
      Navigation.registerComponent('glimmer.PageAnnet', () => PageAnnet, store, Provider);
      Navigation.registerComponent('glimmer.PageSettings', () => PageSettings, store, Provider);
      Navigation.registerComponent('glimmer.PageGjemsel', () => PageGjemsel, store, Provider);
      Navigation.registerComponent('glimmer.PageAbout', () => PageAbout, store, Provider);
      Navigation.registerComponent('glimmer.PageFirst', () => PageFirst, store, Provider);
      Navigation.registerComponent('glimmer.PageUserProfile', () => PageUserProfile, store, Provider);
      Navigation.registerComponent('glimmer.PageStart', () => PageStart, store, Provider);

      // Helper pages
      Navigation.registerComponent('glimmer.PageLogin', () => PageLogin, store, Provider);
      Navigation.registerComponent('glimmer.PageKretsVelger', () => PageKretsVelger, store, Provider);

      // Menus etc.
      Navigation.registerComponent('glimmer.PersonPopup', () => PersonPopup, store, Provider);
      Navigation.registerComponent('glimmer.PopupEmbedViewer', () => PopupEmbedViewer, store, Provider);

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
