import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../../frontE2E/testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import {
  selectProvider,
  setChangeFlightPriceLargeIncrease,
} from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import { selectTripNumber } from '../../../common/src/rf_pages/result';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import {
  addAllExtraProducts,
  addNoExtraProducts,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  closeSeatMapModal,
  saveSeatMapSelections,
  selectSeatsForAllSegmentTypes,
} from '../../../common/src/rf_pages/seatMap';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';

const url = getSiteUrl('supersaver-se', config.host);

const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
};
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
const origin = 'Stockholm';
const destination = 'London';

fixture('Go to payment page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

/*
  To start this test in terminal:
 testcafe "chrome" origin/uitest/flowtests/semi-automated/src/tests/*.js -e -t 'Payment page with PSP Adyen and without extra products'
 */
test('Payment page with PSP Adyen and without extra products', async () => {
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
  await t.debug();
});

/*
  To start this test in terminal:
 testcafe "chrome" flowtests/semi-automated/src/tests/*.js -e -t 'Payment page with PSP Adyen and with all extra products'
 */
test('Payment page with PSP Adyen and with all extra products', async () => {
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
  await addAllExtraProducts(numberOfAdults + numberOfChildren, travelers);
  await bookFlight();
  // Seatmap
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
  // Payment page
  await t.debug();
});

/*
  To start this test in terminal:
 testcafe "chrome" flowtests/semi-automated/src/tests/*.js -e -t 'Payment page with PSP Adyen and price change'
 */
// This test renders a modal with price change info between payment page and order page
test('Payment page with PSP Adyen and price change', async () => {
  /* For now the prop does not work in responsive flow
    const testProps = {
      'DevTestOnly.ForcePnrCreationPhaseAddToCart': false,
    };
    await setProps(testProps);  */

  await setChangeFlightPriceLargeIncrease();
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
  await t.debug();
});
