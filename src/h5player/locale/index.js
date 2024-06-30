import Vue from 'vue'
import axios from 'axios'
import VueI18n from 'vue-i18n'

import messages from '@/locale/lang/zh-CN'

Vue.use(VueI18n)

const defLang = 'zh-CN'

/* Define list of supported languages */
const langSupport = [
  defLang,
  'en-US'
]

/* Language prefix mapping table. */
const langMap = {
  zh: defLang,
  en: 'en-US'
}

/**
 * Obtain the best language information currently supported based on the provided
 * @param lang (string) -required The language information currently provided
 */
function getLangSupport (lang) {
  let result = lang || defLang
  if (langSupport.includes(lang)) {
    result = lang
  } else {
    const prefix = lang.split('-')[0]
    result = langMap[prefix] || defLang
  }
  return result
}

const loadedLanguages = [defLang]

/* A i18n instance for the entire application */
const i18n = new VueI18n({
  locale: defLang,
  fallbackLocale: defLang,
  messages: {
    'zh-CN': messages
  }
})

/* Get client locale to determnine language */
function getClientLang () {
  return navigator.languages ? navigator.languages[0] : navigator.language
}

/* Set the language identifier */
function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

/**
 * Asynchronously load and apply the language pack
 * @param lang (string) -required language pack
 * @param messages (object) -optional custom language
 * @returns {Promise<any>|Promise<T | never>}
 */
function loadLanguageAsync (lang, messages) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `@/locale/lang/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        messages && i18n.mergeLocaleMessage(lang, messages)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}

/* Add alias for load language async */
const use = loadLanguageAsync

export {
  i18n,
  defLang,
  langSupport,
  getLangSupport,
  getClientLang,
  loadedLanguages,
  loadLanguageAsync,
  use
}
