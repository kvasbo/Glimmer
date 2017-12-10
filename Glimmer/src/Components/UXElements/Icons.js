// Define all your icons once,
// load them once,
// and use everywhere

import Ionicons from 'react-native-vector-icons/Ionicons';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
  'ios-star': [25, '#bbb'],
  'ios-chatbubbles': [25, '#fff'],
  'ios-people': [30, '#bbb'],
  'ios-paper': [25, '#bbb'],
  'ios-ribbon': [25, '#bbb'],
  'ios-settings': [25, '#bbb'],
  'ios-list': [25, '#bbb'],
  'ios-home': [25, '#bbb'],
  'ios-more': [25, '#bbb'],
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
