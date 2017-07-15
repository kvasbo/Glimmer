import {Navigation} from "react-native-navigation";

import PageSplashScreen from "./Components/PageSplashScreen";
import PageStream from "./Components/PageStream";
import PageFavorites from "./Components/PageFavorites";
import PageThread from "./Components/PageThread";
import PageMessages from "./Components/PageMessages";
import PageConversation from "./Components/PageConversation";
import PageNewForumComment from "./Components/PageNewForumComment";
import PageKretsVelger from "./Components/PageKretsVelgerNewMessage";
import PageNewMessage from "./Components/PageNewMessage";
import PageNewForumPost from "./Components/PageNewForumPost";

import PageLogin from "./Components/PageLogin";
import PageForumList from "./Components/PageForumList";

import PersonPopup from "./Components/UXElements/PersonPopup";
import PopupEmbedViewer from "./Components/UXElements/PopupEmbedViewer";

export function registerScreens(store, Provider) {

    return new Promise((resolve, reject) => {

        try {
            //Proper pages
            Navigation.registerComponent('glimmer.PageSplashScreen', () => PageSplashScreen, store, Provider);
            Navigation.registerComponent('glimmer.PageStream', () => PageStream, store, Provider);
            Navigation.registerComponent('glimmer.PageFavorites', () => PageFavorites, store, Provider);
            Navigation.registerComponent('glimmer.PageThread', () => PageThread, store, Provider);
            Navigation.registerComponent('glimmer.PageMessages', () => PageMessages, store, Provider);
            Navigation.registerComponent('glimmer.PageConversation', () => PageConversation, store, Provider);
            Navigation.registerComponent('glimmer.PageNewMessage', () => PageNewMessage, store, Provider);
            Navigation.registerComponent('glimmer.PageNewForumComment', () => PageNewForumComment, store, Provider);
            Navigation.registerComponent('glimmer.PageForumList', () => PageForumList, store, Provider);
            Navigation.registerComponent('glimmer.PageNewForumPost', () => PageNewForumPost, store, Provider);

            //Helper pages
            Navigation.registerComponent('glimmer.PageLogin', () => PageLogin, store, Provider);
            Navigation.registerComponent('glimmer.PageKretsVelger', () => PageKretsVelger, store, Provider);

            //Menus etc.
            Navigation.registerComponent('glimmer.PersonPopup', () => PersonPopup, store, Provider);
            Navigation.registerComponent('glimmer.PopupEmbedViewer', () => PopupEmbedViewer, store, Provider);

            resolve();
        }
        catch (err) {
            reject(err);
        }

    })

}
