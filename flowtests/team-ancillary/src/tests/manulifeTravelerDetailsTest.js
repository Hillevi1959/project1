import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import {
  closeHeaderUrgencyBanner,
  searchAndSelectTrip,
  chooseTripType,
} from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import {
  addNoExtraProducts,
  addManulifeCancellation,
  addManulifeAllInclusive,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import { messageUk } from '../../../common/src/rf_pages/order';
import {
  addCheckoutData,
  addPaymentData,
  checkPaymentConditions,
  openCartIfClosed,
} from '../../../common/src/rf_pages/payment';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
  getFirstChild,
  getFirstInfant,
} from '../../../common/src/util/travelerData';
import { getPriceFromText } from '../../../common/src/util/price';
import config from './testdata.json';

const url = getSiteUrl('test-uk', config.host);

const props = {
  'Feature.NewResponsive.Enabled': true,
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
};

fixture('Manulife products verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Book and pay for a one way trip with Trip Cancellation Protection for one adult traveler', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  await chooseTripType('one way trip');
  await searchAndSelectTrip(travelers.length, 0, 0, 'one way trip', 'STO', 'LON', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);

  await t
    .expect(travelerDetailsModule.manulifeCancellationContainer.exists)
    .ok()
    .expect(travelerDetailsModule.manulifeAllinclusiveContainer.exists)
    .notOk();

  await addNoExtraProducts(travelers.length);

  await addManulifeCancellation(travelers);

  const totalPrice = getPriceFromText(
    await travelerDetailsModule.manulifeCancellationTotalPrice.innerText,
  );

  const cartPrice = getPriceFromText(
    await travelerDetailsModule.cartTripCancellationPrice.innerText,
  );

  await t.expect(cartPrice).eql(totalPrice);

  await bookFlight();
  await closeSeatMapModal();

  await t.click(paymentModule.cardLabel);
  await t.expect(paymentModule.cardPaymentForm.exists).ok('', { timeout: 90000 });

  await openCartIfClosed();

  await t
    .expect(paymentModule.cartTripCancellationProduct.visible)
    .ok()
    .expect(paymentModule.cartTripCancellationProduct.innerText)
    .contains(`${travelers.length} Manulife Cancellation Protection`);

  const paymentCartPrice = getPriceFromText(
    await paymentModule.cartTripCancellationPrice.innerText,
  );

  await t.expect(paymentCartPrice).eql(totalPrice);

  await addPaymentData();
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
  await addCheckoutData();

  await t
    .expect(orderModule.infoTextOrderPage.visible)
    .ok('', { timeout: 90000 })
    .expect(orderModule.infoTextOrderPage.innerText)
    .contains(messageUk);

  await t.expect(orderModule.cartTripCancellationProduct.visible).ok();

  const orderCartPrice = getPriceFromText(await orderModule.cartTripCancellationPrice.innerText);

  await t.expect(orderCartPrice).eql(totalPrice);
});

test('Book and pay for a return trip with All Inclusive Protection for 2 adults, child and an infant', async () => {
  const adults = [getFirstAdult(), getSecondAdult()];
  const children = [getFirstChild()];
  const infants = [getFirstInfant()];
  const travelers = addNumberToTraveler([...adults, ...children, ...infants]);
  await searchAndSelectTrip(
    adults.length,
    children.length,
    infants.length,
    'return trip',
    'STO',
    'LON',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);

  await t
    .expect(travelerDetailsModule.manulifeCancellationContainer.exists)
    .ok()
    .expect(travelerDetailsModule.manulifeAllinclusiveContainer.exists)
    .ok();

  await addNoExtraProducts(adults.length + children.length);

  await addManulifeAllInclusive(travelers);

  const totalPrice = getPriceFromText(
    await travelerDetailsModule.manulifeAllinclusiveTotalPrice.innerText,
  );

  const cartPrice = getPriceFromText(await travelerDetailsModule.cartAllInclusivePrice.innerText);

  await t.expect(cartPrice).eql(totalPrice);

  await bookFlight();
  await closeSeatMapModal();
  await t.click(paymentModule.cardLabel);
  await t.expect(paymentModule.cardPaymentForm.exists).ok('', { timeout: 90000 });

  await openCartIfClosed();

  await t
    .expect(paymentModule.cartAllInclusiveProduct.visible)
    .ok()
    .expect(paymentModule.cartAllInclusiveProduct.innerText)
    .contains(`${travelers.length} Manulife All Inclusive`);

  const paymentCartPrice = getPriceFromText(await paymentModule.cartAllInclusivePrice.innerText);

  await t.expect(paymentCartPrice).eql(totalPrice);

  await addPaymentData();
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
  await addCheckoutData();

  await t
    .expect(orderModule.infoTextOrderPage.visible)
    .ok('', { timeout: 90000 })
    .expect(orderModule.infoTextOrderPage.innerText)
    .contains(messageUk);

  await t.expect(orderModule.cartAllInclusiveProduct.visible).ok();

  const orderCartPrice = getPriceFromText(await orderModule.cartAllInclusivePrice.innerText);

  await t.expect(orderCartPrice).eql(totalPrice);
});
