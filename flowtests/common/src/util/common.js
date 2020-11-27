import { ClientFunction, Selector, t } from 'testcafe';
import dateToYMD from './dateFunction';
import { getUrlSearchParameters } from './clientFunction';

export async function acceptCookies() {
  await t.expect(Selector('[data-testid="cookieBanner-confirmButton"]').visible).ok();
  await t.click('[data-testid="cookieBanner-confirmButton"]');
}

export function getSiteUrl(site, host) {
  switch (site) {
    case 'supersaver-se':
      return `https://supersaver-se${host}/rf/start`;
    case 'gotogate-uk':
      return `https://gotogate-uk${host}/rf/start`;
    case 'gotogate-ru':
      return `https://gotogate-ru${host}/rf/start`;
    case 'test-uk':
      return `https://test-uk${host}/rf/start`;
    case 'gotogate-au-nustay':
      return `https://gotogate-au${host}/from/nustay/rf/start`;
    case 'postbooking-supersaver-se':
      return `https://supersaver-se${host}/rf/postbooking-login`;
    case 'postbooking-gotogate-uk':
      return `https://gotogate-uk${host}/rf/postbooking-login`;
    case 'gotogate-uk-orderlogin':
      return `https://gotogate-uk${host}/rf/order-login`;
    case 'SE-meta':
      return `https://supersaver-se${host}`;
    case 'SE':
      return `https://supersaver-se${host}/flyg`;
    case 'UK':
      return `https://gotogate-uk${host}/flight`;
    case 'gotogate-uk-edvin':
      return `https://gotogate-uk${host}/edvin`;
    default:
      return null;
  }
}

export async function reloadWindow() {
  // eslint-disable-next-line no-restricted-globals
  await t.eval(() => location.reload(true));
}

export const getNumberOfElements = ClientFunction(
  selector => document.querySelectorAll(selector).length,
);

export function getDateOfBirth(age) {
  const now = new Date(Date.now());
  let dateOfBirth;

  if (age === 0) {
    now.setMonth(now.getMonth() - 6);
    dateOfBirth = dateToYMD(now);
  } else if (age >= 1) {
    now.setFullYear(now.getFullYear() - age);
    dateOfBirth = dateToYMD(now);
  }
  return dateOfBirth;
}

export const getSelectorAttribute = ClientFunction((selector, attr, i) =>
  document.querySelectorAll(selector)[i].getAttribute(attr),
);

export async function getOrderNumberFromUrl() {
  return new URLSearchParams(await getUrlSearchParameters()).get('orderNumber');
}

export async function emptyField(selector) {
  await t.click(selector).pressKey('ctrl+a delete');
}