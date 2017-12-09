import { AsyncStorage } from 'react-native';
import { uniq, without } from 'lodash';

export default class Gjemsel {
  constructor() {
    this.init();
    this.krok = [];
    console.log('init gjemsel', this.krok);
  }

  init = async () => {
    const krok = await AsyncStorage.getItem('skammekroken');
    if (krok !== null) {
      this.krok = JSON.parse(krok);
      console.log('krok hentet', this.krok);
    } else {
      this.krok = [];
      this.saveKrok();
    }
  };

  saveKrok() {
    console.log('Lagrer krok', this.krok);
    AsyncStorage.setItem('skammekroken', JSON.stringify(this.krok));
  }

  getKrok() {
    return this.krok;
  }

  addToKrok(id) {
    console.log('legg til i skammekrok', id);
    let tmpKrok = [...this.krok];
    tmpKrok.push(id);
    tmpKrok = uniq(tmpKrok);
    this.krok = tmpKrok;
    this.saveKrok();
  }

  removeFromKrok(id) {
    console.log('fjern fra skammekrok', id);
    let tmpKrok = [...this.krok];
    tmpKrok = without(tmpKrok, id);
    this.krok = tmpKrok;
    this.saveKrok();
  }
}
