import de from '../assets/languages/de.json';
import en from '../assets/languages/en.json';

enum Language {
  EN = 'en',
  DE = 'de'
}

type Locale = {
  [key: string]: string;
};

let language: string = Language.EN;
let locale: Locale = en;

setLanguage(Language.EN);
export function setLanguage(value: Language) {
  console.log('Setting language to: ' + value);
  switch (value) {
    case Language.EN:
      language = value;
      locale = en;
      return en;
    case Language.DE:
      language = value;
      locale = de;
      return de;
  }

  console.log('Language', value, 'not found');
  console.log('Current language:', language);
}

export function text(key: string, ...args: any[]): string {
  const value = locale[key] ? locale[key] : `[${key}]`;
  // Replace all instances of '%%' in the string with the passed in arguments
  return value.replace(/%%/g, () => args.shift());
}
