import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';

import en from "./locales/en";
import es from "./locales/es";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.currentLanguage = () => {
  return I18n.currentLocale().split("-")[0];
}


I18n.switchLanguage = async () => {

  let localCode = I18n.currentLanguage();

  //await AsyncStorage.setItem('selectedLang', localCode);

  I18n.locale = localCode === "es" ? "en" : "es";
  I18n.defaultLocale = localCode === "es" ? "en" : "es";
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  es
};

export default I18n;