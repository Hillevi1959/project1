/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { Selector, t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getNumberOfElements, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import config from '../../../frontE2E/testdata.json';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
  getThirdAdult,
  getFourthAdult,
  getSecondChild,
  getSecondInfant,
} from '../../../common/src/util/travelerData';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { selectTripNumber } from '../../../common/src/rf_pages/result';
import {
  addContact,
  addTraveler,
  addTravelerInformation,
  bookFlight,
} from '../../../common/src/rf_pages/travelerDetails';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { acceptPriceChange, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  createVoucherInEdvin,
  getDiscountCode,
  getDiscountCodeUrl,
} from '../../../common/src/rf_pages/edvin';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { getWindowWidth } from '../../../common/src/util/device';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { scrollToElement } from '../../../common/src/util/clientFunction';
import edvinModule from '../../../common/src/rf_modules/edvinModule';

const url = getSiteUrl('gotogate-uk', config.host);
const urlEdvin = getSiteUrl('gotogate-uk-edvin', config.host);
const props = {
  'PaymentService.CascadingPaymentsBehavior.Enabled': false,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'Result.SelfServiceRebooking.ValidWithVoucherTag.Enable': true,
  'Result.SelfServiceRebooking.ValidWithVoucherSwitch.Enable': true,
};
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const newTravelers = addNumberToTraveler([
  getThirdAdult(),
  getFourthAdult(),
  getSecondChild(),
  getSecondInfant(),
]);
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
const origin = 'Stockholm';
const destination = 'London';

async function createOrderAndDiscountCode() {
  const site = 'https://gotogate-uk';
  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  console.log('Search for trip');
  await makeSearch('one way trip', origin, destination, 10);
  await t.expect(resultModule.toggleFilterButton.visible).ok('', { timeout: 20000 });
  await scrollToElement('[data-testid="resultPage-toggleFiltersButton-button"]');
  await t
    .click(resultModule.toggleFilterButton)
    .click(resultModule.clearAirlines)
    .click(resultModule.filterAirlineSasCheckbox)
    .click(resultModule.toggleFilterButton);
  await selectTripNumber(0);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();
  await payWithCreditCard();
  await acceptPriceChange();
  await waitForOrderPageToLoad();
  const orderNumber = await orderModule.orderNumber.innerText;
  console.log('Order number: ', orderNumber);
  await t.navigateTo(`${urlEdvin}/order/Order.list.action?_s=true&searching=true`);
  if (await edvinModule.userNameInput.visible) {
    await t
      .typeText(edvinModule.userNameInput, 'autotest')
      .typeText(edvinModule.passwordInput, 'gurkburk')
      .click(edvinModule.logInButton);
  }
  await createVoucherInEdvin(site, orderNumber);
}

async function prepareSelfServiceRebookingFlow() {
  await t.navigateTo(url);
  await enableDebug();
  await selectProvider('Amadeus');
  await setProps(props);
  await t.navigateTo(getDiscountCodeUrl());
  console.log('Go to SSR start page');
}

fixture('Verify self service rebooking flow semi automated')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await selectProvider('Amadeus');
    await setProps(props);
    await acceptCookies();
    await closeHeaderUrgencyBanner();
  });
/*
  To make this test run without errors after first deploy, an order search needs to be done manually in Edvin
 */
test('Create order in self service rebooking flow semi automated', async () => {
  if ((await getWindowWidth()) < 970) {
    // eslint-disable-next-line no-console
    console.warn('This test is not run on mobile or tablet device');
  } else {
    await createOrderAndDiscountCode();
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow();
    await t.debug();
  }
});

test.skip('Choose trip that does not match the voucher, verify message, add new travelers', async () => {
  if ((await getWindowWidth()) < 970) {
    // eslint-disable-next-line no-console
    console.warn('This test is not run on mobile or tablet device');
  } else {
    await t.navigateTo(url);
    await enableDebug();
    await selectProvider('Sabre');
    // await selectProvider('Amadeus');
    await setProps(props);
    await acceptCookies();
    await closeHeaderUrgencyBanner();
    await createOrderAndDiscountCode();
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow();
    await makeSearch('one way trip', origin, destination, 20);

    let tripNumber = 0;
    await t.expect(resultModule.resultPage.visible).ok('', { timeout: 5000 });
    // Select trip without voucher tag
    while (
      (await getNumberOfElements(
        `[data-testid*="resultPage-resultTrip-${tripNumber}"] [data-testid="valid-with-voucher-tag"]`,
      )) === 1
    ) {
      tripNumber += 1;
      if (tripNumber === 10) {
        await t.click(resultModule.searchFormButton);
        await t.click(resultModule.departureDate);
        await t.click(Selector('.DayPicker-Day').nth(27));
        await t.click(resultModule.searchFlight);
        tripNumber = 0;
      }
    }
    const tripWithoutVoucher = Selector(
      `[data-testid*="resultPage-resultTrip-${tripNumber}"] [data-testid="resultPage-book-button"]`,
    ).nth(0);
    await t.click(tripWithoutVoucher);

    // Verify TD-page
    await t.expect(travelerDetailsModule.voucherNotValidInfo.visible).ok();

    await addContact(travelers[0], true);
    for (const traveler of newTravelers) {
      await addTraveler(traveler);
    }
    await addNoExtraProducts(numberOfAdults + numberOfChildren);
    await bookFlight();
    await closeSeatMapModal();

    // Verify payment page
    await t.expect(paymentModule.paymentContainer.visible).ok();
    await t.expect(paymentModule.voucherNotValidInfo.visible).ok();

    await t.click(paymentModule.discountCodeToggleInput);
    await t.typeText(paymentModule.discountCodeInput, getDiscountCode());
    await t.click(paymentModule.discountCodeButton);

    await t.expect(paymentModule.discountCodeError.visible).ok();

    await t.click(paymentModule.discountCodeInput).pressKey('ctrl+a delete');
    await payWithCreditCard();
    await acceptPriceChange();
    // Verify order page
    await waitForOrderPageToLoad();

    await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);

    await t.click(orderModule.showBaggageButton);

    for (let i = 0; i < newTravelers.length; i += 1) {
      await t
        .expect(orderModule.travelerName.nth(i).innerText)
        .contains(`${newTravelers[i].firstName} ${newTravelers[i].lastName}`);
    }
  }
  console.log('Choose trip that does not match the voucher flow PASSED!');
});