import {Navigation} from "react-native-navigation";

import PageStream from "../Components/PageStream";
import PageFavorites from "../Components/PageFavorites";
import PageThread from "../Components/PageThread";
import PageCalendar from "../Components/PageCalendar";
import PageMessages from "../Components/PageMessages";
import PageSettings from "../Components/PageSettings";
import PageConversation from "../Components/PageConversation";
import PageNewForumPost from "../Components/PageNewForumPost";
import PageKretsVelger from "../Components/PageKretsVelger";

import PageLogin from "../Components/PageLogin";
import PageForumList from "../Components/PageForumList";
import PageLog from "../Components/PageLog";

import MenuLeft from "../Components/MenuLeft";

export function registerScreens(store, Provider) {

    return new Promise((resolve, reject) => {

        //Proper pages
        Navigation.registerComponent('glimmer.PageStream', () => PageStream, store, Provider);
        Navigation.registerComponent('glimmer.PageFavorites', () => PageFavorites, store, Provider);
        Navigation.registerComponent('glimmer.PageThread', () => PageThread, store, Provider);
        Navigation.registerComponent('glimmer.PageMessages', () => PageMessages, store, Provider);
        Navigation.registerComponent('glimmer.PageSettings', () => PageSettings, store, Provider);
        Navigation.registerComponent('glimmer.PageConversation', () => PageConversation, store, Provider);
        Navigation.registerComponent('glimmer.PageCalendar', () => PageCalendar, store, Provider);
        Navigation.registerComponent('glimmer.PageNewForumPost', () => PageNewForumPost, store, Provider);
        Navigation.registerComponent('glimmer.PageKretsVelger', () => PageKretsVelger, store, Provider);

        //Helper pages
        Navigation.registerComponent('glimmer.PageForumList', () => PageForumList, store, Provider);
        Navigation.registerComponent('glimmer.PageLogin', () => PageLogin, store, Provider);
        Navigation.registerComponent('glimmer.PageLog', () => PageLog, store, Provider);

        //Menus etc.
        Navigation.registerComponent('glimmer.MenuLeft', () => MenuLeft, store, Provider);

        resolve();

    })

}
