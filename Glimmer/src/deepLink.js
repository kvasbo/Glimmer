export default function handleDeeplink(navigator, link) {
  if (link === 'stream') {
    navigator.push({
      screen: 'glimmer.PageStream', // unique ID registered with Navigation.registerScreen
      title: 'Strøm', // navigation bar title of the pushed screen (optional)
      passProps: {}, // simple serializable object that will pass as props to the pushed screen (optional)
      animated: false, // does the resetTo have transition animation or does it happen immediately (optional)
    });
  }
}
