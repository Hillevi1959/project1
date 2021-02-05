/* eslint-disable no-console */
/* eslint-disable consistent-return */
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
import { isMobile, isTablet } from '../../../common/src/util/device';
import {
  checkForDiscountCodes,
  logInToEdvin,
  setPriceOnproduct,
} from '../../../common/src/rf_pages/edvin';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  addCheckoutData,
  checkPaymentConditions,
  payWithCreditCard,
} from '../../../common/src/rf_pages/payment';
import config from '../../testdata.json';
import orderModule from '../../../common/src/rf_modules/orderModule';
import {
  convertTextPricePoundToNumber,
  removeUnicodeFromTextPrice,
} from '../../../common/src/util/price';
import {
  goToPostbookingFromOrderPage,
  waitForOrderPageToLoad,
} from '../../../common/src/rf_pages/order';
import postbookingModule from '../../../common/src/rf_modules/postbookingModule';
import { clickGoToPayment } from '../../../common/src/rf_pages/postBookingProduct';

const url = getSiteUrl('test-uk', config.host);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
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
  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
    return;
  }
  await checkForDiscountCodes(campaignId, discountName);
  await t.navigateTo(url);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'Sydney', 'ECONOMY', [
    11,
    24,
  ]);
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
  await waitForOrderPageToLoad();
  const ticketPrice = convertTextPricePoundToNumber(await orderModule.ticketPrice.innerText);
  const voucherSum = convertTextPricePoundToNumber(await orderModule.discountPrice.innerText);
  const totalPrice = convertTextPricePoundToNumber(await orderModule.totalPrice.innerText);

  await t.expect(totalPrice).eql(ticketPrice + voucherSum);
});

test('Voucher does not cover price change', async () => {
  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
    return;
  }
  await setChangeFlightPriceLargeIncrease();
  await checkForDiscountCodes(campaignId, discountName);
  await t.navigateTo(url);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'Sydney', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  // Verify payment page
  await t.expect(paymentModule.paymentContainer.visible).ok();
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
  await addCheckoutData();
  // Verify order page
  await waitForOrderPageToLoad();
  const totalPrice = convertTextPricePoundToNumber(await orderModule.totalPrice.innerText);

  await t.expect(totalPrice > 0).ok();
});

test('Zero cart in postbooking flow', async () => {
  const zeroPrice = '£0.00';
  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
    return;
  }
  await logInToEdvin(`http://test-uk${config.host}/edvin/login.action`);
  await setPriceOnproduct('0', 'Order Information SMS');
  // Create order
  await t.navigateTo(url);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'London', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.visible).ok();
  // Verify postbooking
  await goToPostbookingFromOrderPage();
  await t.click(postbookingModule.smsYesButton);
  await clickGoToPayment();

  await t.expect(postbookingModule.payInternalPaymentMethod.visible).ok();
  await t
    .expect(removeUnicodeFromTextPrice(await postbookingModule.priceSummayPrice.innerText))
    .eql(zeroPrice);
  await t
    .expect(removeUnicodeFromTextPrice(await postbookingModule.cartSmsProductPrice.innerText))
    .eql(zeroPrice);
  await t
    .expect(removeUnicodeFromTextPrice(await postbookingModule.cartTotalPrice.innerText))
    .eql(zeroPrice);

  await t.click(paymentModule.checkPaymentConditions);
  await t.click(paymentModule.payButton);
  // Verify order page
  await waitForOrderPageToLoad();

  await t
    .expect(removeUnicodeFromTextPrice(await orderModule.postBookingTotalPrice.innerText))
    .eql(zeroPrice);
  await t.expect(orderModule.postBookingProducts.innerText).contains('Booking number by SMS');
  await t
    .expect(removeUnicodeFromTextPrice(await orderModule.posBookingProductPrice.innerText))
    .eql(zeroPrice);
});
