import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';

const travelers = addNumberToTraveler([getFirstAdult()]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'BookingFlow.FreeCancellation.Enable': true,
  'BookingFlow.FreeCancellationDaysAhead.Enabled@kayak': true,
  'BookingFlow.FreeCancellationDaysAhead': '8',
};
const numberOfAdults = 1;

fixture('Conditional textkey on payment page');

test.before(async () => {
  const url = getSiteUrl('gotogate-us-kayak', config.host);
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Text verification for Kayak, departure day more than 8 days ahead', async () => {
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'Paris', 'New York', 'ECONOMY', [11, 24]);

  await t.expect(resultModule.freeCancellationDaysAheadText.visible).ok();

  await selectTripButtonByIndex(0);

  await t.expect(travelerDetailsModule.freeCancellationDaysAheadText.visible).ok();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();

  await t.expect(paymentModule.freeCancellationDaysAheadText.visible).ok();

  await payWithCreditCard();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.orderPage.visible).ok();
});

test('Text verification for Kayak, departure day less than 8 days ahead', async () => {});

test('Text verification for Kayak, property BookingFlow.FreeCancellationDaysAhead.Enabled@kayak set to false', async () => {});
