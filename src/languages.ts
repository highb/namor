import namesAr from "./data/names-ar.json";
import namesAz from "./data/names-az.json";
import namesBg from "./data/names-bg.json";
import namesBs from "./data/names-bs.json";
import namesCs from "./data/names-cs.json";
import namesDa from "./data/names-da.json";
import namesDe from "./data/names-de.json";
import namesEl from "./data/names-el.json";
import namesEn from "./data/names-en.json";
import namesEs from "./data/names-es.json";
import namesEt from "./data/names-et.json";
import namesFi from "./data/names-fi.json";
import namesFr from "./data/names-fr.json";
import namesHe from "./data/names-he.json";
import namesHi from "./data/names-hi.json";
import namesHr from "./data/names-hr.json";
import namesHu from "./data/names-hu.json";
import namesHy from "./data/names-hy.json";
import namesIs from "./data/names-is.json";
import namesIt from "./data/names-it.json";
import namesJa from "./data/names-ja.json";
import namesKa from "./data/names-ka.json";
import namesKk from "./data/names-kk.json";
import namesKo from "./data/names-ko.json";
import namesLt from "./data/names-lt.json";
import namesLv from "./data/names-lv.json";
import namesMk from "./data/names-mk.json";
import namesMt from "./data/names-mt.json";
import namesNl from "./data/names-nl.json";
import namesNo from "./data/names-no.json";
import namesPl from "./data/names-pl.json";
import namesPt from "./data/names-pt.json";
import namesRo from "./data/names-ro.json";
import namesRu from "./data/names-ru.json";
import namesSk from "./data/names-sk.json";
import namesSl from "./data/names-sl.json";
import namesSq from "./data/names-sq.json";
import namesSr from "./data/names-sr.json";
import namesSv from "./data/names-sv.json";
import namesTr from "./data/names-tr.json";
import namesUk from "./data/names-uk.json";
import namesVi from "./data/names-vi.json";
import namesZh from "./data/names-zh.json";

export interface LangEntry {
  code: string;
  label: string;
}

export interface RegionGroup {
  name: string;
  langs: LangEntry[];
}

export const REGIONS: RegionGroup[] = [
  {
    name: "Western Europe",
    langs: [
      { code: "en", label: "English" },
      { code: "de", label: "German" },
      { code: "fr", label: "French" },
      { code: "nl", label: "Dutch" },
    ],
  },
  {
    name: "Southern Europe",
    langs: [
      { code: "es", label: "Spanish" },
      { code: "pt", label: "Portuguese" },
      { code: "it", label: "Italian" },
      { code: "el", label: "Greek" },
      { code: "mt", label: "Maltese" },
      { code: "sq", label: "Albanian" },
    ],
  },
  {
    name: "Nordic",
    langs: [
      { code: "da", label: "Danish" },
      { code: "fi", label: "Finnish" },
      { code: "is", label: "Icelandic" },
      { code: "no", label: "Norwegian" },
      { code: "sv", label: "Swedish" },
    ],
  },
  {
    name: "Baltic",
    langs: [
      { code: "et", label: "Estonian" },
      { code: "lt", label: "Lithuanian" },
      { code: "lv", label: "Latvian" },
    ],
  },
  {
    name: "Eastern Europe",
    langs: [
      { code: "cs", label: "Czech" },
      { code: "hu", label: "Hungarian" },
      { code: "pl", label: "Polish" },
      { code: "ro", label: "Romanian" },
      { code: "ru", label: "Russian" },
      { code: "sk", label: "Slovak" },
      { code: "uk", label: "Ukrainian" },
    ],
  },
  {
    name: "Balkans",
    langs: [
      { code: "bg", label: "Bulgarian" },
      { code: "bs", label: "Bosnian" },
      { code: "hr", label: "Croatian" },
      { code: "mk", label: "Macedonian" },
      { code: "sl", label: "Slovenian" },
      { code: "sr", label: "Serbian" },
    ],
  },
  {
    name: "Caucasus & Central Asia",
    langs: [
      { code: "az", label: "Azerbaijani" },
      { code: "hy", label: "Armenian" },
      { code: "ka", label: "Georgian" },
      { code: "kk", label: "Kazakh" },
      { code: "tr", label: "Turkish" },
    ],
  },
  {
    name: "Middle East & North Africa",
    langs: [
      { code: "ar", label: "Arabic" },
      { code: "he", label: "Hebrew" },
    ],
  },
  {
    name: "East & South Asia",
    langs: [
      { code: "hi", label: "Hindi" },
      { code: "ja", label: "Japanese" },
      { code: "ko", label: "Korean" },
      { code: "vi", label: "Vietnamese" },
      { code: "zh", label: "Chinese" },
    ],
  },
];

export const LANG_DATA: Record<string, string[]> = {
  ar: namesAr, az: namesAz, bg: namesBg, bs: namesBs, cs: namesCs,
  da: namesDa, de: namesDe, el: namesEl, en: namesEn, es: namesEs,
  et: namesEt, fi: namesFi, fr: namesFr, he: namesHe, hi: namesHi,
  hr: namesHr, hu: namesHu, hy: namesHy, is: namesIs, it: namesIt,
  ja: namesJa, ka: namesKa, kk: namesKk, ko: namesKo, lt: namesLt,
  lv: namesLv, mk: namesMk, mt: namesMt, nl: namesNl, no: namesNo,
  pl: namesPl, pt: namesPt, ro: namesRo, ru: namesRu, sk: namesSk,
  sl: namesSl, sq: namesSq, sr: namesSr, sv: namesSv, tr: namesTr,
  uk: namesUk, vi: namesVi, zh: namesZh,
};
