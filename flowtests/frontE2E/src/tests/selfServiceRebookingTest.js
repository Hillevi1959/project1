/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Selector, t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getNumberOfElements, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, makeSearch } from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
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
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import { addContact, addTraveler, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import {
  acceptPriceChange,
  addPaymentData,
  checkPaymentConditions,
  payWithDummyBank,
} from '../../../common/src/rf_pages/payment';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { getDiscountCode, getDiscountCodeUrl } from '../../../common/src/rf_pages/edvin';
import { getWindowWidth } from '../../../common/src/util/device';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { getTripPricePound, getVoucherPricePound } from '../../../common/src/util/price';
import {
  createOrderAndDiscountCode,
  prepareSelfServiceRebookingFlow,
} from '../../../common/src/util/selfServiceReboking';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

let url = getSiteUrl('gotogate-uk', config.host);
let props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
  'Result.SelfServiceRebooking.ValidWithVoucherTag.Enable': true,
  'Result.SelfServiceRebooking.ValidWithVoucherSwitch.Enable': true,
};
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const numberOfAdults = 2;
const numberOfChildren = 1;
const origin = 'Mauritius';
const destination = 'New Delhi';

fixture('Verify self service rebooking flow')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await selectProvider('Sabre');
    await setProps(props);
    await acceptCookies();
    await closeHeaderUrgencyBanner();
  });

test.skip('Create order in self service rebooking flow', async () => {
  if ((await getWindowWidth()) < 970) {
    console.warn('This test is not run on mobile or tablet device');
  } else {
    const dummyPaymentFalse = false;
    await createOrderAndDiscountCode('https://gotogate-uk', 'gotogate-uk-edvin', dummyPaymentFalse);
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow(url);
    // Verify start page
    const voucherMessageRow1 = 'Welcome! You are a few steps away from using your voucher.';
    const voucherMessageRow2 =
      'Some of your information is prefilled and cannot be changed. Please make sure to apply the voucher on the payment step.';
    await t.expect(startModule.voucherMessage1.innerText).contains(voucherMessageRow1);
    await t.expect(startModule.voucherMessage2.innerText).contains(voucherMessageRow2);

    await t.click(startModule.travelerDropDown);

    await t.expect(startModule.travelerAdultsCounterPlus.hasAttribute('disabled')).ok();
    await t.expect(startModule.travelerChildrenCounterPlus.hasAttribute('disabled')).ok();
    await t.expect(startModule.travelerInfantsCounterPlus().hasAttribute('disabled')).ok();

    await makeSearch('one way trip', origin, destination, 20);

    // Verify result page
    await t.expect(resultModule.resultPage.visible).ok('', { timeout: 20000 });

    await t.click(resultModule.searchFormButton).click(resultModule.travelerDropDown);

    await t.expect(resultModule.travelerAdultsCounterPlus.hasAttribute('disabled')).ok();
    await t.expect(resultModule.travelerChildrenCounterPlus.hasAttribute('disabled')).ok();
    await t.expect(resultModule.travelerInfantsCounterPlus().hasAttribute('disabled')).ok();

    await t.click(resultModule.searchFormButton);
    // Verify voucher tags
    let numberOfVoucherTrips = await getNumberOfElements(
      '[data-testid*="resultPage-resultTrip-"] [data-testid="valid-with-voucher-tag"]',
    );
    let numberOfAllTrips = await getNumberOfElements('[data-testid*="resultPage-resultTrip-"]');

    await t.expect(await numberOfAllTrips).gte(await numberOfVoucherTrips);

    await t.click(resultModule.voucherSwitch);
    numberOfAllTrips = await getNumberOfElements('[data-testid*="resultPage-resultTrip-"]');
    numberOfVoucherTrips = await getNumberOfElements(
      '[data-testid*="resultPage-resultTrip-"] [data-testid="valid-with-voucher-tag"]',
    );

    await t.expect(await numberOfVoucherTrips).eql(await numberOfAllTrips);

    // Verify voucher price
    await t.click(resultModule.cheapestFilterButton);
    const tripPriceStandard = getTripPricePound(await resultModule.tripPriceStandard.innerText);
    const tripPriceFlex = getTripPricePound(await resultModule.tripPriceFlex.innerText);
    const voucherPriceFlex = getVoucherPricePound(await resultModule.voucherFlexPrice.innerText);
    const voucherPriceStandard = getVoucherPricePound(
      await resultModule.voucherStandardPrice.innerText,
    );

    await t.expect(resultModule.voucherStandardPrice.visible).ok();
    await t.expect(resultModule.voucherFlexPrice().visible).ok();
    await t.expect(tripPriceStandard).gt(voucherPriceStandard);
    await t.expect(tripPriceFlex).gt(voucherPriceFlex);

    await selectTripButtonByIndex(0);
    // verify TD-page
    await addContact(travelers[0]);

    for (const traveler of travelers) {
      // Check for each traveler the radio buttons are disabled
      for (let i = 0; i < 2; i += 1) {
        await t
          .expect(
            travelerDetailsModule
              .travelerInput(traveler.nr)
              .nth(i)
              .hasAttribute('disabled'),
          )
          .eql(true);
      }
      // Check for each traveler the input fields are readonly
      for (let i = 2; i < 4; i += 1) {
        await t
          .expect(
            travelerDetailsModule
              .travelerInput(traveler.nr)
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
    await t.click(paymentModule.cardLabel);
    await addPaymentData();

    await t.expect(paymentModule.discountCodeSuccess.visible).ok();
    await t.expect(paymentModule.cartDiscountCode.innerText).contains('Your discount voucher');

    await checkPaymentConditions();
    await t.click(paymentModule.payButton);
    await acceptPriceChange();

    await t.expect(orderModule.selfServiceRebookingImage.visible).ok('', { timeout: 20000 });
    const infoText =
      'Your rebooking request is being processed. Please note that this may take up to 24 hours.';
    await t.expect(orderModule.selfServiceRebookingInfoText.innerText).contains(infoText);
    console.log('Create order in self service rebooking flow PASSED!');
  }
});

test.skip('Choose trip that does not match the voucher, verify message, add new travelers', async () => {
  url = getSiteUrl('supersaver-se', config.host);
  const newTravelers = addNumberToTraveler([
    getThirdAdult(),
    getFourthAdult(),
    getSecondChild(),
    getSecondInfant(),
  ]);
  const dummyPaymentTrue = true;
  props = {
    'Result.SelfServiceRebooking.ValidWithVoucherTag.Enable': true,
    'Result.SelfServiceRebooking.ValidWithVoucherSwitch.Enable': true,
    'Payment.RemoveAdressForBank.Enable': false,
  };
  if ((await getWindowWidth()) < 970) {
    console.warn('This test is not run on mobile or tablet device');
  } else {
    await t.navigateTo(url);
    await enableDebug();
    await selectProvider('Sabre');
    await setProps(props);
    await setIBEDummyPaymentBankOn();
    await acceptCookies();
    await closeHeaderUrgencyBanner();
    await createOrderAndDiscountCode(
      'https://supersaver-se',
      'supersaver-se-edvin',
      dummyPaymentTrue,
    );
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow(url);
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

    await t
      .click(paymentModule.discountCodeToggleInput)
      .typeText(paymentModule.discountCodeInput, getDiscountCode())
      .click(paymentModule.discountCodeButton);

    await t.expect(paymentModule.discountCodeError.visible).ok();

    await t.click(paymentModule.discountCodeInput).pressKey('ctrl+a delete');
    await payWithDummyBank(travelers[0]);
    await acceptPriceChange();
    // Verify order page
    await waitForOrderPageToLoad();

    await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);

    await t.click(orderModule.showBaggageButton);

    for (let i = 0; i < newTravelers.length; i += 1) {
      await t
        .expect(orderModule.travelerName.nth(i).innerText)
        .contains(`${newTravelers[i].firstName} ${newTravelers[i].lastName}`);
    }
  }
  console.log('Choose trip that does not match the voucher flow PASSED!');
});
