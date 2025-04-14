import i18n, { InitOptions } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";
import { Languages } from "../settings";

const DETECTION_ORDER = ["querystring", "navigator"];
const SUPPORTED_LANGUAGES = [Languages.FR, Languages.EN];
const LOOKUP_QUERYSTRING = "lng";

const i18nConfig: InitOptions = {
  debug: import.meta.env.VITE_DEBUG === "true",
  detection: {
    order: DETECTION_ORDER,
    lookupQuerystring: LOOKUP_QUERYSTRING,
  },
  fallbackLng: Languages.FR,
  interpolation: { escapeValue: false },
  preload: SUPPORTED_LANGUAGES,
  react: {
    bindI18n: "languageChanged",
    useSuspense: true,
  },
  resources,
  returnObjects: true,
  supportedLngs: SUPPORTED_LANGUAGES,
};

i18n.use(new LanguageDetector()).use(initReactI18next).init(i18nConfig);

export { i18n, SUPPORTED_LANGUAGES };
