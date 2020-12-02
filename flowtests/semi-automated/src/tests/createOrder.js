/* eslint-disable no-console */
import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import config from '../../../frontE2E/testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  closeSeatMapModal,
  saveSeatMapSelections,
  selectSeatsForAllSegmentTypes,
} from '../../../common/src/rf_pages/seatMap';
import { addCheckoutData, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { selectTripNumber } from '../../../common/src/rf_pages/result';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('gotogate-uk', config.host);
// const url = getSiteUrl('supersaver-se', config.host);

const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
};
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
const origin = 'Stockholm';
const destination = 'London';

fixture('Go to order page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

/*
   To fill in the Checkout modal after postbooking, press "Resume" to get to order page
   To start this test in terminal:
   testcafe "chrome" flowtests/semi-automated/src/tests/*.js -e -t 'Go to order page with all extra products'
  */
test('Go to order page with seatMap product', async () => {
  // Start page
  await searchTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    origin,
    destination,
  );
  // Result page
  await selectTripNumber(0);
  // TD-page
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  // Seatmap
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
  // Payment page
  await payWithCreditCard();
  await addCheckoutData();
  // Order page
  await waitForOrderPageToLoad();
  const orderNumber = await orderModule.orderNumber.innerText;
  console.log('Order number = ', orderNumber);
  await t.debug();
  // Go manually to postbooking and fill in data. When you need to fill in checkout, press resume
  await addCheckoutData();
  await t.debug();
});

/*
 To fill in the Checkout modal after postbooking, press "Resume" to get to order page
 To start this test in terminal:
 testcafe "chrome" flowtests/semi-automated/src/tests/*.js -e -t 'Go to order page without extra products'
*/
test('Go to order page without extra products', async () => {
  // Start page
  await searchTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    origin,
    destination,
  );
  // Result page
  await selectTripNumber(0);
  // TD-page
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  // Seatmap
  await closeSeatMapModal();
  // Payment page
  await payWithCreditCard();
  await addCheckoutData();
  // Order page
  await waitForOrderPageToLoad();
  const orderNumber = await orderModule.orderNumber.innerText;
  console.log('Order number = ', orderNumber);
  await t.debug();
  // Go manually to postbooking and fill in data. When you need to fill in checkout, press resume
  await addCheckoutData();
  await t.debug();
});
