import packageInfo from '../../package.json';

export const environment = {
  production: false,
  appVersion: packageInfo.version,
  apiUrl: 'https://dbchallengeserver.onrender.com',
  siteUrl: 'https://dokkena.vercel.app',
  siteName: 'Dokkena',
  gaId: '',
  whatsappNumber: '',
  freeShippingThreshold: 100
};
