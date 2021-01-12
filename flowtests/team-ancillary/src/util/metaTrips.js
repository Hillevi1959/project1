import dateToYMD from '../../../common/src/util/dateFunction';

const fetch = require('node-fetch');

export async function getTripFlexTicket(host) {
  const dateFrom = getDateFrom();
  const dateTo = getDateTo(dateFrom);
  const url = `${host}/ws/ultrasearch/2.0/flygresor.se?bounds=STOBKK${dateFrom},BKKSTO${dateTo}&travellers=t1&brand=supersaver&country=SE&onlydirectflights=false&format=json&token=Zmx5Z3Jlc29yLnNlOiFydGdmODd1ag==&etraveli-api-test-systems=IbeGDSDummy`;
  console.log(`url: ${url}`);
  return (
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => `${data.offers.offer[0].url}`)
      // eslint-disable-next-line no-console
      .catch(error => console.error(error))
  );
}

export async function getTrip(host) {
  const dateFrom = getDateFrom();
  const dateTo = getDateTo(dateFrom);
  const url = `${host}/ws/ultrasearch/2.0/flygresor.se?bounds=BCNMAD${dateFrom},MADBCN${dateTo}&travellers=t1&brand=supersaver&country=SE&onlydirectflights=false&format=json&token=Zmx5Z3Jlc29yLnNlOiFydGdmODd1ag==&etraveli-api-test-systems=IbeGDSDummy`;
  console.log(`url: ${url}`);
  return (
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => `${data.offers.offer[0].url}`)
      // eslint-disable-next-line no-console
      .catch(error => console.error(error))
  );
}

export async function getTripBaggageIncluded(host) {
  const dateFrom = getDateFrom();
  const url = `${host}/ws/ultrasearch/2.0/flygresor.se?bounds=MADIST${dateFrom}&travellers=t1&brand=supersaver&country=SE&onlydirectflights=false&format=json&token=Zmx5Z3Jlc29yLnNlOiFydGdmODd1ag==&etraveli-api-test-systems=IbeGDSDummy`;
  console.log(`url: ${url}`);
  return (
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => `${data.offers.offer[0].url}`)
      // eslint-disable-next-line no-console
      .catch(error => console.error(error))
  );
}
function getDateFrom() {
  const now = new Date(Date.now());
  let dateFrom;

  now.setMonth(now.getMonth() + 2);
  dateFrom = dateToYMD(now);
  return dateFrom;
}

function getDateTo() {
  let dateTo;
  const now = new Date(Date.now());

  now.setMonth(now.getMonth() + 2);
  now.setTime(now.getTime() + 14 * 86400000);
  dateTo = dateToYMD(now);
  return dateTo;
}
