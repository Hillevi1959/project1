/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { ClientFunction, Selector, t } from 'testcafe';
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
import { getCurrentUrl, navigateToUrl } from '../../../common/src/util/clientFunction';
import edvinModule from '../../../common/src/rf_modules/edvinModule';
import { openDropdown } from '../../../common/src/util/dropdownSelect';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getFirstInfant()]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'Invoice.Generation.Enabled': 'true',
};
const numberOfAdults = 1;
const numberOfInfants = 1;

fixture('Verify payment link')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

// eslint-disable-next-line consistent-return
test('Create add on cart in Edvin and verify payment link', async () => {
  if ((await isMobile()) || (await isTablet())) {
    return console.warn('This test is not run on mobile or tablet device');
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
  );
  // const orderNumber = 'DTESTG6GY';
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
  } while (!(await edvinModule.providerBookingIdLink.visible) && iteration < 20);

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
  await t.typeText(edvinModule.activatePaymentLinkTextArea, 'TEST');
  await t.click(edvinModule.paymentLinkSendEmailCheckbox);
  await t.click(edvinModule.createPaymentLinkButton);

  const originUrl = await getCurrentUrl();
  console.log('Origin url: ', originUrl);
  const url0 = originUrl.split('3D')[1];
  const orderId = url0.split('%')[0];
  console.log('OrderId: ', orderId);
  const orderUrl = `https://gotogate-uk${config.host}/edvin/core/order/OrderContainer.edit.action?_s=true&id=${orderId}`;
  await t.navigateTo(orderUrl);
  await openDropdown(edvinModule.addOnCartActionsDropdown);

  await t
    .setNativeDialogHandler(() => {
      document.getElementById('createCartSection').innerHTML = 'TEST1';
      document.getElementById('createCartSection').innerHTML += ' TEST2';
      const action = document.execCommand('copy');
      document.getElementById('createCartSection').innerHTML += ' TEST3';
      // document.getElementById('createCartSection').innerHTML += action;
      document.getElementById('createCartSection').innerHTML += 'TEST4';
      return action;
    })
    .click(edvinModule.copyPaymentLinkSelection);
  // await t.setNativeDialogHandler(() => true).click(edvinModule.copyPaymentLinkSelection);
  await t.debug();

  const execPaste = ClientFunction(() => document.execCommand('paste'));
  await t.click(Selector('#addOnPurchasePlaceholder>div>div:nth-child(2)'));
  console.log(await execPaste());
  await t.debug();

  // const execCopy = ClientFunction( () => document.execCommand('copy'));
  // const overrideClipboardCopy = ClientFunction(() => {
  //   document.getElementById('createCartSection').innerHTML = 'TEST av execCommand';
  //   const { execCommand } = document;
  //   document.execCommand = (action, ...args) => {
  //     if (action === 'copy') {
  //       console.log(args);
  //       console.log(...args);
  //     } else {
  //       return execCommand.call(document, ...args);
  //     }
  //   };
  // });

  // await t.setNativeDialogHandler(overrideClipboardCopy).click(edvinModule.createPaymentLinkButton);

  // ClientFunction(() => document.execCommand('copy'));
  //
  // ClientFunction(() => document.execCommand('paste'));
  //
  //   navigator.clipboard.readText().then(clipText => console.log(clipText)),
  // );
  // console.log(text);
  //
  // await t.setNativeDialogHandler(() => true).click(edvinModule.copyPaymentLinkSelection);
});
//
// function copy(str) {
//   var sandbox = $('#sandbox').val(str).select();
//   document.execCommand('copy');
//   sandbox.val('');
// }
//
// function paste() {
//   var result = '',
//     sandbox = $('#sandbox').val('').select();
//   if (document.execCommand('paste')) {
//     result = sandbox.val();
//   }
//   sandbox.val('');
//   return result;
// }
