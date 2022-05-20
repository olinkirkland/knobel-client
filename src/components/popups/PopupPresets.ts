import { SectionType } from './PopupBook';

export const cookie = {
  title: 'We use cookies.',
  sections: [
    {
      type: SectionType.BODY,
      data: 'We use cookies to improve your experience. We do not use cookies for advertising. By continuing to use this site, you agree to our use of cookies.'
    }
  ],
  okButton: 'Accept and continue',
  onClose: () => {
    localStorage.setItem('cookie-popup-viewed', 'true');
  }
};

export const impressum = {
  title: 'Impressum',
  sections: [
    {
      type: SectionType.TITLE,
      data: 'Angaben gemäß § 5 TMG'
    },
    {
      type: SectionType.TITLE,
      data: 'Vertreten durch'
    },
    {
      type: SectionType.BODY,
      data: 'Kevin Poppe'
    },
    {
      type: SectionType.BODY,
      data: 'Olin Kirkland'
    },
    {
      type: SectionType.TITLE,
      data: 'Kontakt'
    },
    {
      type: SectionType.BODY,
      data: 'Telefon: 0160-91118502'
    },
    {
      type: SectionType.BODY,
      data: 'E-Mail: Kevin@KevinPoppe.com'
    },
    {
      type: SectionType.TITLE,
      data: 'Haftungsausschluss'
    },
    {
      type: SectionType.TITLE,
      data: 'Urheberrecht'
    },
    {
      type: SectionType.BODY,
      data: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.'
    },
    {
      type: SectionType.TITLE,
      data: 'Datenschutz'
    },
    {
      type: SectionType.BODY,
      data: 'Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.'
    }
  ]
};
