import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import de from './de.json'
import fr from './fr.json'
import {
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
  resolveInitialLocale,
} from './locale'

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
  },
  lng: resolveInitialLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  const code = lng.slice(0, 2).toLowerCase()
  if (typeof localStorage !== 'undefined' && isSupportedLocale(code)) {
    localStorage.setItem(LOCALE_STORAGE_KEY, code)
  }
})

export default i18n
