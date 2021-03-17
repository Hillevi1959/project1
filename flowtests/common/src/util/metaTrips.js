import dateToYMD from './dateFunction';

const fetch = require('node-fetch');

function getDateFrom() {
  const now = new Date(Date.now());
  now.setMonth(now.getMonth() + 2);
  return dateToYMD(now);
}

function getDateTo() {
  const now = new Date(Date.now());
  now.setMonth(now.getMonth() + 2);
  now.setTime(now.getTime() + 14 * 86400000);
  return dateToYMD(now);
}

export default async function getTrip(host) {
  const dateFrom = getDateFrom();
  const dateTo = getDateTo(dateFrom);
  const url = `${host}/ws/ultrasearch/2.0/hp?bounds=STOLON${dateFrom},LONSTO${dateTo}&travellers=t1&brand=supersaver&country=SE&onlydirectflights=false&devicetype=PC&applicationtype=BROWSER&useragent=Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_13_3)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/65.0.3325.181%20Safari/537.36&format=json&token=aHA6aHA=&etraveli-api-test-systems=IbeGDSDummy`;
  return (
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => `${data.offers.offer[0].url}&ibe.m=true`)
      // eslint-disable-next-line no-console
      .catch(error => console.error(error))
  );
}

export async function getTripWithCountryAndBrand(host, brand, country) {
  const dateFrom = getDateFrom();
  const dateTo = getDateTo(dateFrom);
  const url = `${host}/ws/ultrasearch/2.0/hp?bounds=STOLON${dateFrom},LONSTO${dateTo}&travellers=t1&brand=${brand}&country=${country}&onlydirectflights=false&devicetype=PC&applicationtype=BROWSER&useragent=Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_13_3)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/65.0.3325.181%20Safari/537.36&format=json&token=aHA6aHA=&etraveli-api-test-systems=IbeGDSDummy`;
  return (
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => `${data.offers.offer[0].url}&ibe.m=true`)
      // eslint-disable-next-line no-console
      .catch(error => console.error(error))
  );
}
