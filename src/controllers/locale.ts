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
  switch (value) {
    case Language.EN:
      currentLanguage = value;
      locale = en;
      localStorage.setItem('language', currentLanguage);
      return;
    case Language.DE:
      currentLanguage = value;
      locale = de;
      localStorage.setItem('language', currentLanguage);
      return;
  }

  console.log('Language', value, 'not found');
  console.log('Current language:', currentLanguage);
}

export function text(key: string, ...args: any[]): string {
  const value = locale[key] ? locale[key] : `[${key}]`;
  if (!locale[key]) console.log('Missing translation:', key);
  // Replace all instances of '%%' in the string with the passed in arguments
  return value.replace(/%%/g, () => args.shift());
}
