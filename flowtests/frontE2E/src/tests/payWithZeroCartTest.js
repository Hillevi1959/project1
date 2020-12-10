import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import {
  selectProvider,
  setChangeFlightPriceLargeIncrease,
} from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import { getWindowWidth } from '../../../common/src/util/device';
import { checkForDiscountCodes } from '../../../common/src/rf_pages/edvin';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { checkPaymentConditions, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import config from '../../testdata.json';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { getTripPricePound } from '../../../common/src/util/price';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('test-uk', config.host);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'Payment.DiscountCode.Enabled': true,
};
const travelers = addNumberToTraveler([getFirstAdult()]);
const numberOfAdults = 1;
const campaignId = 3782;
const discountName = 'DISCOUNTZERO';

fixture('Zero cart verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug(true);
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Discount covers the whole trip cost', async () => {
  if ((await getWindowWidth()) < 970) {
    // eslint-disable-next-line no-console
    console.warn('This test is not run on mobile or tablet device');
  } else {
    await checkForDiscountCodes(campaignId, discountName);
    await t.navigateTo(url);
    await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'Sydney');
    await addTravelerInformation(travelers);
    await addNoExtraProducts(numberOfAdults);
    await bookFlight();
    await closeSeatMapModal();

    await t.click(paymentModule.discountCodeToggleInput);
    await t.typeText(paymentModule.discountCodeInput, discountName);
    await t.click(paymentModule.discountCodeButton);
    // Verify payment page
    await t.expect(paymentModule.cardPaymentForm.visible).notOk();
    await t.expect(paymentModule.zeroCartNotification.visible).ok();
    await t.expect(paymentModule.cartDiscountCode.visible).ok();
    await t.expect(paymentModule.cartPrice.innerText).contains('£0.00');
    await t.expect(paymentModule.priceBoxDiscountCodeSum.visible).ok();
    await t.expect(paymentModule.priceBoxAmountToPay.innerText).contains('£0.00');

    await checkPaymentConditions();
    await t.click(paymentModule.payButton);
    // Verify order page
    const ticketPrice = getTripPricePound(await orderModule.ticketPrice.innerText);
    const voucherSum = getTripPricePound(await orderModule.discountPrice.innerText);
    const totalPrice = getTripPricePound(await orderModule.totalPrice.innerText);

    await t.expect(totalPrice === ticketPrice + voucherSum).ok();
  }
});

test('Voucher does not cover price change', async () => {
  await setChangeFlightPriceLargeIncrease();
  await checkForDiscountCodes(campaignId, discountName);
  await t.navigateTo(url);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'Sydney');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  // Verify payment page
  await t.click(paymentModule.discountCodeToggleInput);
  await t.typeText(paymentModule.discountCodeInput, discountName);
  await t.click(paymentModule.discountCodeButton);

  await t.expect(paymentModule.cardPaymentForm.visible).notOk();
  await t.expect(paymentModule.zeroCartNotification.visible).ok();
  await t.expect(paymentModule.cartDiscountCode.visible).ok();

  await t.click(paymentModule.checkPaymentConditions);
  await t.click(paymentModule.payButton);

  await t.expect(paymentModule.priceChangeModal.visible).ok();

  await t.click(paymentModule.priceChangeModalCloseButton);

  await t.expect(paymentModule.cardPaymentForm.visible).ok();
  await t.expect(paymentModule.zeroCartNotification.visible).notOk();
  await t.expect(paymentModule.priceBoxDiscountCodeSum.visible).notOk();
  await t.expect(paymentModule.cartDiscountCode.visible).notOk();

  await payWithCreditCard();
  // Verify order page
  await waitForOrderPageToLoad();
  const totalPrice = getTripPricePound(await orderModule.totalPrice.innerText);

  await t.expect(totalPrice > 0).ok();
});
