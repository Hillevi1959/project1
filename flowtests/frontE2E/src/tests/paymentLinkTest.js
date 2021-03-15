/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Selector, t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner } from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstInfant,
} from '../../../common/src/util/travelerData';
import { createOrderWithNoProducts } from '../../../common/src/util/createOrder';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { logInToEdvin, searchOrder } from '../../../common/src/rf_pages/edvin';
import { isMobile, isTablet } from '../../../common/src/util/device';
import { navigateToUrl } from '../../../common/src/util/clientFunction';
import edvinModule from '../../../common/src/rf_modules/edvinModule';
import paymentLinkModule from '../../../common/src/rf_modules/paymentLinkModule';
import getPaymentData from '../../../common/src/util/paymentData';
import { addCheckoutData } from '../../../common/src/rf_pages/payment';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getFirstInfant()]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
  'Invoice.Generation.Enabled': 'true',
};
const numberOfAdults = 1;
const numberOfInfants = 1;

async function convertLinkToResponsive(link) {
  const splitLink = link.split('=');
  const paymentLink = getSiteUrl('gotogate-uk-paymentLink', config.host);
  return paymentLink.concat(splitLink[1]);
}

fixture('Verify payment link')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

// This test will be updated when payment link for responsive is generated in Edvin.
// There will be no need of function convertLinkToResponsive
test('Create add on cart in Edvin and verify payment link', async () => {
  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
    return;
  }
  await createOrderWithNoProducts(
    numberOfAdults,
    0,
    numberOfInfants,
    travelers,
    'return trip',
    'STO',
    'Paris',
    'CARD',
    'ECONOMY',
    [11, 24],
  );
  const orderNumber = await orderModule.orderNumber.innerText;
  console.log('Order number: ', orderNumber);
  await logInToEdvin(getSiteUrl('gotogate-uk-edvin', config.host));

  let iteration = 0;
  do {
    let urlOrder = await searchOrder('https://gotogate-uk', orderNumber);

    if (await Selector('.alert.alert-info', { timeout: 1000 }).visible) {
      await t.click(Selector('.edvin-menu.edvin-menu-left'));
      urlOrder = searchOrder('https://gotogate-uk', orderNumber);
    }
    await navigateToUrl(urlOrder);
    iteration += 1;
    console.log('Search for order: ', orderNumber);
  } while (!(await edvinModule.providerBookingIdLink.visible) && iteration < 10);

  const travelDocumentsByPost = 14;
  const mobileTravelPlan = 15;
  const checkIn = 16;

  await t.click(edvinModule.addOnPurchaseButton);
  await t.click(edvinModule.createAddOnCartButton);
  await t.expect(edvinModule.addOnProductsModal.visible).ok();
  await t.click(edvinModule.avaliableAddOnProducts(travelDocumentsByPost));
  await t.click(edvinModule.avaliableAddOnProducts(mobileTravelPlan));
  await t.click(edvinModule.avaliableAddOnProducts(checkIn));
  await t.click(edvinModule.activatePaymentLinkButton);

  const link = await edvinModule.paymentLink.getAttribute('value');
  await t.navigateTo(await convertLinkToResponsive(link));

  // Verfy addon products on payment page
  await t.expect(paymentLinkModule.paymentLinkPage.visible).ok();
  await t.expect(paymentLinkModule.checkInProduct.visible).ok();
  await t.expect(paymentLinkModule.flightUpdatesBySmsProduct.visible).ok();
  await t.expect(paymentLinkModule.travelDocumentsByPostProduct.visible).ok();

  const paymentData = getPaymentData();
  await t.click(paymentLinkModule.cardLabel);
  await t.typeText(paymentLinkModule.cardNumberInput, paymentData.cardNumber);
  await t.typeText(paymentLinkModule.cardExpInput, paymentData.exp);
  await t.typeText(paymentLinkModule.cardCvcInput, paymentData.cvc);
  await t.typeText(paymentLinkModule.cardFirstNameInput, paymentData.firstName);
  await t.typeText(paymentLinkModule.cardLastNameInput(), paymentData.lastName);
  await t.click(paymentLinkModule.checkPaymentConditions);
  await t.click(paymentLinkModule.payButton);
  await addCheckoutData();

  // Verfy addon products on order page
  await waitForOrderPageToLoad();
  await t.expect(orderModule.postBookingProducts.count).eql(3);
  await t
    .expect(orderModule.postBookingProductsText.nth(0).innerText)
    .contains('Travel documents by post');
  await t
    .expect(orderModule.postBookingProductsText.nth(2).innerText)
    .contains('Flight updates by SMS');
  await t.expect(orderModule.postBookingProductsText.nth(4).innerText).contains('Check-in');
});
