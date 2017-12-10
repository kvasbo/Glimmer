import { StyleSheet } from 'react-native';
import * as colors from './colorConstants';

const textStyles = StyleSheet.create({

  uxTitle: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 3,
  },

  uxExplain: {
    fontSize: 12,
    color: colors.COLOR_DARKGREY,
    fontWeight: '300',
    marginBottom: 3,
  },

  paragraph: {
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },

});

export default textStyles;
