// Define all your icons once,
// load them once,
// and use everywhere

import Ionicons from 'react-native-vector-icons/Ionicons';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big|top-menu|tab-bar)/g;
const icons = {
  'ios-star--tab-bar': [25, '#bbb'],
  'ios-chatbubbles--tab-bar': [25, '#fff'],
  'ios-ribbon--tab-bar': [25, '#bbb'],
  'ios-list--tab-bar': [30, '#bbb'],
  'ios-home--tab-bar': [35, '#bbb'],
  'ios-more--top-menu': [25, '#bbb'],
};

const defaultIconProvider = Ionicons;

const iconsMap = {};
const iconsLoaded = new Promise((resolve) => {
  new Promise.all(Object.keys(icons).map((iconName) => {
    const Provider = icons[iconName][2] || defaultIconProvider; // Ionicons
    return Provider.getImageSource(
      iconName.replace(replaceSuffixPattern, ''),
      icons[iconName][0],
      icons[iconName][1],
    );
  })).then((sources) => {
    Object.keys(icons)
      .forEach((iconName, idx) => iconsMap[iconName] = sources[idx]);

    // Call resolve (and we are done)
    resolve(true);
  });
});

export {
  iconsMap,
  iconsLoaded,
};
