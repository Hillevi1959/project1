import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
import { checkForDiscountCodes } from '../../../common/src/rf_pages/edvin';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addCheckoutData,
  addPaymentData,
  checkPaymentConditions,
} from '../../../common/src/rf_pages/payment';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { getWindowWidth } from '../../../common/src/util/device';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const url = getSiteUrl('test-uk', config.host);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
  'Payment.DiscountCode.Enabled': true,
};
const campaignId = 3355;
const discountName = 'TESTDISCOUNTCODE';

fixture('Discount code verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug(true);
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Verify discount use on payment and order page', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  const numberOfAdults = 1;
  if ((await getWindowWidth()) < 970) {
    // eslint-disable-next-line no-console
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
  await t.click(paymentModule.cardLabel);
  await scrollToElement('[for="CARD"]');
  await t.click(paymentModule.cardLabel);
  await addPaymentData();

  // Verification on payment page
  await t
    .expect(paymentModule.cartDiscountCode.exists)
    .notOk()
    .expect(paymentModule.priceBoxDiscountCodeSum.exists)
    .notOk();

  await t.click(paymentModule.discountCodeToggleInput);
  await t.typeText(paymentModule.discountCodeInput, discountName);
  await t.click(paymentModule.discountCodeButton);

  await t
    .expect(paymentModule.cartDiscountCode.visible)
    .ok()
    .expect(paymentModule.priceBoxDiscountCodeSum.visible)
    .ok();

  await t.click(paymentModule.discountCodeRemoveButton);

  await t.expect(paymentModule.cartDiscountCode.exists).notOk();
  await t.expect(paymentModule.priceBoxDiscountCodeSum.exists).notOk();

  await t
    .expect(paymentModule.cartDiscountCode.exists)
    .notOk()
    .expect(paymentModule.priceBoxDiscountCodeSum.exists)
    .notOk()
    .typeText(paymentModule.discountCodeInput, discountName);

  await t.click(paymentModule.discountCodeButton);

  await t
    .expect(paymentModule.cartDiscountCode.visible)
    .ok()
    .expect(paymentModule.priceBoxDiscountCodeSum.visible)
    .ok();

  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
  await addCheckoutData();
  // Verification on order page
  await waitForOrderPageToLoad();
  await t.expect(orderModule.receiptInformation.innerText).contains('Your discount voucher');
});
