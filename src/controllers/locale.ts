import de from '../assets/languages/de.json';
import en from '../assets/languages/en.json';

export enum Language {
  EN = 'en',
  DE = 'de'
}

type Locale = {
  [key: string]: string;
};

export let currentLanguage: Language = Language.EN;
let locale: Locale = en;

export let initialLanguage: Language = localStorage.getItem(
  'language'
)! as Language;
if (!initialLanguage) initialLanguage = Language.EN;
setAppLanguage(initialLanguage);

export function setAppLanguage(value: Language) {
  console.log('Setting language to: ' + value);
  currentLanguage = value;
  if (value === Language.EN) locale = en;
  if (value === Language.DE) locale = de;
}

export function setLanguageForNextStart(value: Language) {
  currentLanguage = value;
  localStorage.setItem('language', value);
}

export function text(key: string, ...args: any[]): string {
  const value = locale[key] ? locale[key] : `[${key}]`;
  if (!locale[key]) console.warn(key);
  // Replace all instances of '%%' in the string with the passed in arguments
  return value.replace(/%%/g, () => args.shift());
}
