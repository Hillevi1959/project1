/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
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
import startModule from '../../../common/src/rf_modules/startModule';
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
import {
  acceptPriceChange,
  addPaymentData,
  checkPaymentConditions,
  payWithCreditCard,
} from '../../../common/src/rf_pages/payment';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  createVoucherInEdvin,
  getDiscountCode,
  getDiscountCodeUrl,
  searchFirstOrderInEdvin,
} from '../../../common/src/rf_pages/edvin';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { isMobile, isTablet } from '../../../common/src/util/device';
import resultModule from '../../../common/src/rf_modules/resultModule';

const url = getSiteUrl('gotogate-uk', config.host);
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

async function createOrderAndDiscountcode() {
  const site = 'https://gotogate-uk';
  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  await makeSearch('one way trip', origin, destination, 10);
  await t
    .expect(resultModule.toggleFilterButton.visible)
    .ok('', { timeout: 20000 })
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
  await createVoucherInEdvin(site, orderNumber);
}

async function prepareSelfServiceRebookingFlow() {
  await t.navigateTo(url);
  await enableDebug();
  await selectProvider('Amadeus');
  await setProps(props);
  await t.navigateTo(getDiscountCodeUrl());
}

fixture('Verify self service rebooking flow')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await selectProvider('Amadeus');
    await setProps(props);
    await acceptCookies();
    await closeHeaderUrgencyBanner();
  });

// eslint-disable-next-line consistent-return
test('Choose trip that does not match the voucher, verify message, add new travelers', async () => {
  if ((await isMobile()) || (await isTablet())) {
    return console.log('This test is not run on mobile or tablet view');
  }
  await searchFirstOrderInEdvin();
  await t.navigateTo(url);
  await createOrderAndDiscountcode();
  console.log('Voucher code: ', getDiscountCode());
  console.log('Voucher url: ', getDiscountCodeUrl());
  await prepareSelfServiceRebookingFlow();
  await makeSearch('one way trip', origin, destination, 20);

  let tripNumber = 0;
  await t.expect(resultModule.resultPage.visible).ok('', { timeout: 20000 });
  // Select trip without voucher tag
  while (
    (await getNumberOfElements(
      `[data-testid*="resultPage-resultTrip-${tripNumber}"] [data-testid="valid-with-voucher-tag"]`,
    )) === 1
  ) {
    tripNumber += 1;
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

  await t.typeText(paymentModule.discountCodeInput, getDiscountCode());
  await t.click(paymentModule.discountCodeButton);

  await t.expect(paymentModule.discountCodeError.visible).ok();

  await t.click(paymentModule.discountCodeInput).pressKey('ctrl+a delete');
  await payWithCreditCard();
  await acceptPriceChange();
  // Verify order page
  waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);

  await t.click(orderModule.showBaggageButton);

  for (let i = 0; i < newTravelers.length; i += 1) {
    await t
      .expect(orderModule.travelerInfo.nth(i).innerText)
      .contains(`${newTravelers[i].firstName} ${newTravelers[i].lastName}`);
  }
});

// eslint-disable-next-line consistent-return
test('Create order in self service rebooking flow', async () => {
  if ((await isMobile()) || (await isTablet())) {
    return console.warn('This test is not run on mobile or tablet view');
  }
  await searchFirstOrderInEdvin();
  await t.navigateTo(url);
  await createOrderAndDiscountcode();
  console.log('Voucher code2: ', getDiscountCode());
  console.log('Voucher url2: ', getDiscountCodeUrl());
  await prepareSelfServiceRebookingFlow();

  // Verify start page
  const voucherMessageRow1 = 'Welcome! You are a few steps away from using your voucher.';
  const voucherMessageRow2 = 'Some of your information is prefilled and cannot be changed. ';
  await t.expect(startModule.startPageSearchForm.innerText).contains(voucherMessageRow1);
  await t.expect(startModule.startPageSearchForm.innerText).contains(voucherMessageRow2);

  await t.click(startModule.travelerDropDown);

  await t.expect(startModule.travelerAdultsCounterPlus.hasAttribute('disabled')).ok();
  await t.expect(startModule.travelerChildrenCounterPlus.hasAttribute('disabled')).ok();
  await t.expect(startModule.travelerInfantsCounterPlus().hasAttribute('disabled')).ok();

  await makeSearch('one way trip', origin, destination, 20);

  // Verify result page
  await t.click(resultModule.searchFormButton);
  await t.click(resultModule.travelerDropDown);

  await t.expect(resultModule.travelerAdultsCounterPlus.hasAttribute('disabled')).ok();
  await t.expect(resultModule.travelerChildrenCounterPlus.hasAttribute('disabled')).ok();
  await t.expect(resultModule.travelerInfantsCounterPlus().hasAttribute('disabled')).ok();

  await t.click(resultModule.searchFormButton);

  // Verify voucher tags
  let numberOfVoucherTrips = await getNumberOfElements(
    '[data-testid*="resultPage-resultTrip-"] [data-testid="valid-with-voucher-tag"]',
  );
  let numberOfTrips = await getNumberOfElements('[data-testid*="resultPage-resultTrip-"]');

  await t.expect(await numberOfTrips).gte(await numberOfVoucherTrips);

  await t.click(resultModule.voucherSwitch);
  numberOfTrips = await getNumberOfElements('[data-testid*="resultPage-resultTrip-"]');
  numberOfVoucherTrips = await getNumberOfElements(
    '[data-testid*="resultPage-resultTrip-"] [data-testid="valid-with-voucher-tag"]',
  );

  await t.expect(await numberOfVoucherTrips).eql(await numberOfTrips);

  await t.click(resultModule.cheapestFilterButton);
  await selectTripNumber(0);

  // verify TD-page
  await addContact(travelers[0]);

  let traveler;
  for (traveler of travelers) {
    for (let i = 0; i < 2; i += 1) {
      await t
        .expect(
          travelerDetailsModule
            .tavelerInput(traveler.nr)
            .nth(i)
            .hasAttribute('disabled'),
        )
        .eql(true);
    }
    for (let i = 2; i < 4; i += 1) {
      await t
        .expect(
          travelerDetailsModule
            .tavelerInput(traveler.nr)
            .nth(i)
            .hasAttribute('readonly'),
        )
        .eql(true);
    }
  }

  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();

  // Verify payment page
  await addPaymentData();

  await t.expect(paymentModule.discountCodeSuccess.visible).ok();
  await t.expect(paymentModule.discountCodePriceBox.innerText).match(/Your discount voucher/);
  await t.expect(paymentModule.cartDiscountCode.innerText).contains('Your discount voucher');

  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
  await acceptPriceChange();

  await t.debug();
  await t.expect(orderModule.selfServiceRebookingImage.visible).ok('', { timeout: 50000 });
  const infoText =
    'Your rebooking request is being processed. Please note that this may take up to 24 hours.';
  await t.expect(orderModule.selfServiceRebookingInfoText.innerText).contains(infoText);
});
