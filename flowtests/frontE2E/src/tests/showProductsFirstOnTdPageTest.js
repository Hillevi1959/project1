import { t } from 'testcafe';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addAllExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import {
  saveSeatMapSelections,
  selectSeatsForAllSegmentTypes,
} from '../../../common/src/rf_pages/seatMap';
import { addCheckoutData, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
  'AB.Responsive.TravelerDetails.DisplayProductsBeforePassengerDetails.Enabled': true,
};
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;

fixture('Show extra products before traveler information on TD-page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Booking flow with extra products at the top of TD-page', async () => {
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'STO',
    'LON',
    'ECONOMY',
    [11, 24],
  );
  const travelersTop = await travelerDetailsModule.travelerContainer.getBoundingClientRectProperty(
    'top',
  );
  const extraProductsTop = await travelerDetailsModule.extraProductsContainer.getBoundingClientRectProperty(
    'top',
  );
  await t.expect(travelersTop).gt(extraProductsTop);
  await addAllExtraProducts(numberOfAdults + numberOfChildren, travelers);
  await addTravelerInformation(travelers);
  await bookFlight();
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
});
