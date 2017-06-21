import {Navigation} from 'react-native-navigation';

import HomeScreen from "../Components/HomeScreen";
import PageStream from "../Components/PageStream";
import PageThread from "../Components/PageThread";
import PageCalendar from "../Components/PageCalendar";
import PageMessages from "../Components/PageMessages";
import PageSettings from "../Components/PageSettings";
import PageConversation from "../Components/PageConversation";
import PageForumList from "../Components/PageForumList";
import PageNewForumPost from "../Components/PageNewForumPost";

import MenuLeft from "../Components/MenuLeft";

export function registerScreens() {

    //Proper pages
    Navigation.registerComponent('glimmer.HomeScreen', () => HomeScreen);
    Navigation.registerComponent('glimmer.PageStream', () => PageStream);
    Navigation.registerComponent('glimmer.PageThread', () => PageThread);
    Navigation.registerComponent('glimmer.PageMessages', () => PageMessages);
    Navigation.registerComponent('glimmer.PageSettings', () => PageSettings);
    Navigation.registerComponent('glimmer.PageConversation', () => PageConversation);
    Navigation.registerComponent('glimmer.PageCalendar', () => PageCalendar);
    Navigation.registerComponent('glimmer.PageNewForumPost', () => PageNewForumPost);

    //Helper pages
    Navigation.registerComponent('glimmer.PageForumList', () => PageForumList);

    //Menus etc.
    Navigation.registerComponent('glimmer.MenuLeft', () => MenuLeft);

}