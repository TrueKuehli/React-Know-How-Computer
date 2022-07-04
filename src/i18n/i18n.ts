import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en_US from './en_US';
import de_DE from './de_DE';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: process.env.NODE_ENV !== "production",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false, // React escapes by default
        },
        resources: {
            en: {translation: en_US},
            de: {translation: de_DE},
        },
    }).then((t) => {
        if (!window.localStorage.getItem('i18nextLng')) {
            window.localStorage.setItem('i18nextLng', i18n.language);
        }

        document.head.title = t("<head>.title");
        (document.head.querySelector('meta[name="description"]') as HTMLMetaElement).content = t("<head>.description");
    });

export default i18n;