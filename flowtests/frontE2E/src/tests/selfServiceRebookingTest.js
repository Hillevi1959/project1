/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { t } from 'testcafe';
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
  addPaymentData,
  checkPaymentConditions,
  payWithDummyBank,
} from '../../../common/src/rf_pages/payment';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { getDiscountCode, getDiscountCodeUrl } from '../../../common/src/rf_pages/edvin';
import { getWindowWidth } from '../../../common/src/util/device';
import resultModule from '../../../common/src/rf_modules/resultModule';
import {
  convertTextPricePoundToNumber,
  getVoucherPricePound,
} from '../../../common/src/util/price';
import {
  createOrderAndDiscountCode,
  prepareSelfServiceRebookingFlow,
  updateDiscountCampaignForCovid19,
} from '../../../common/src/util/selfServiceReboking';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { getMonthInFuture } from '../../../common/src/util/dateFunction';

const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const numberOfAdults = 2;
const numberOfChildren = 1;
const origin = 'Stockholm';
const destination = 'London';
const validDate = getMonthInFuture(6);

fixture('Verify self service rebooking flow');

test.before(async () => {
  const url = getSiteUrl('gotogate-uk', config.host);
  const props = {
    'Payment.FraudAssessment.Accertify.ShadowMode': true,
    'Payment.provider.creditcard': 'adyen',
    'Result.SelfServiceRebooking.ValidWithVoucherTag.Enable': true,
    'Result.SelfServiceRebooking.ValidWithVoucherSwitch.Enable': true,
  };

  await updateDiscountCampaignForCovid19('SK', validDate);
  await t.navigateTo(url);
  await enableDebug();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await acceptCookies();
  await closeHeaderUrgencyBanner();
})('Create order in self service rebooking flow', async () => {
  if ((await getWindowWidth()) < 970) {
    console.warn('This test is not run on mobile or tablet device');
  } else {
    const url = getSiteUrl('gotogate-uk', config.host);
    const dummyPaymentFalse = false;
    await createOrderAndDiscountCode('https://gotogate-uk', 'gotogate-uk-edvin', dummyPaymentFalse);
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow(url);

    // Verify start page
    const voucherMessageRow1 = 'Welcome! You are a few steps away from using your voucher.';
    const voucherMessageRow2 =
      'Some of your information is prefilled and cannot be changed. Please make sure to apply the voucher on the payment step.';
    await t.expect(startModule.startPageSearchForm.visible).ok();
    await t.expect(startModule.voucherMessage1.innerText).contains(voucherMessageRow1);
    await t.expect(startModule.voucherMessage2.innerText).contains(voucherMessageRow2);

    await t.click(startModule.ssrReadMoreButton);

    await t.expect(startModule.ssrVoucherCriteria.nth(0).innerText).contains('Flight');
    await t
      .expect(startModule.ssrVoucherCriteria.nth(1).innerText)
      .contains(`Valid Until ${validDate}`);
    await t
      .expect(startModule.ssrVoucherCriteria.nth(2).innerText)
      .contains(`Departure Until ${validDate}`);
    await t
      .expect(startModule.ssrVoucherCriteria.nth(3).innerText)
      .contains(`Return Until ${validDate}`);
    await t.expect(startModule.ssrVoucherCriteria.nth(4).innerText).contains('Travel With SAS');

    // This will cause the test to be unstable until bug WEB-4921 is solved
    await t.expect(startModule.ssrTravelers.nth(0).innerText).contains('Kalle Kula');
    await t.expect(startModule.ssrTravelers.nth(1).innerText).contains('Lotta Kula');
    await t.expect(startModule.ssrTravelers.nth(2).innerText).contains('Agnes Kula');
    await t.expect(startModule.ssrTravelers.nth(3).innerText).contains('Lovisa Kula');

    await t.click(startModule.travelerDropDown);

    await t.expect(startModule.travelerAdultsCounterPlus.hasAttribute('disabled')).ok();
    await t.expect(startModule.travelerChildrenCounterPlus.hasAttribute('disabled')).ok();
    await t.expect(startModule.travelerInfantsCounterPlus().hasAttribute('disabled')).ok();

    await makeSearch('one way trip', origin, destination, [20]);

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
    const tripPriceStandard = convertTextPricePoundToNumber(
      await resultModule.tripPriceStandard.innerText,
    );
    const tripPriceFlex = convertTextPricePoundToNumber(await resultModule.tripPriceFlex.innerText);
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
    await t.expect(paymentModule.paymentContainer.visible).ok();
    await t.click(paymentModule.cardLabel);
    await addPaymentData();

    await t.expect(paymentModule.discountCodeText.innerText).contains('Your discount voucher');
    await t.expect(paymentModule.discountCodeText.innerText).contains('£-10.00');
    await t.expect(paymentModule.cartDiscountCode.innerText).contains('Your discount voucher');
    await t.expect(paymentModule.cartDiscountCode.innerText).contains('£-10.00');

    await checkPaymentConditions();
    await t.click(paymentModule.payButton);

    await t.expect(orderModule.selfServiceRebookingImage.visible).ok('', { timeout: 20000 });
    await t
      .expect(orderModule.selfServiceRebookingTitle.innerText)
      .contains(travelers[0].firstName);
    const infoText =
      'Your rebooking request is being processed. Please note that this may take up to 24 hours.';
    await t.expect(orderModule.selfServiceRebookingInfoText.innerText).contains(infoText);
  }
});

test.before(async () => {
  const url = getSiteUrl('supersaver-se', config.host);
  const dummyPaymentTrue = true;
  const props = {
    'Result.SelfServiceRebooking.ValidWithVoucherTag.Enable': true,
    'Result.SelfServiceRebooking.ValidWithVoucherSwitch.Enable': true,
    'Payment.ForceShowAddressFields.Carriers': '',
    'Payment.RemoveAdressForBank.Enable': false,
  };
  await updateDiscountCampaignForCovid19('SK', validDate);
  await t.navigateTo(url);
  await enableDebug();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await setIBEDummyPaymentBankOn();
  await acceptCookies();
  await closeHeaderUrgencyBanner();
  await createOrderAndDiscountCode(
    'https://supersaver-se',
    'supersaver-se-edvin',
    dummyPaymentTrue,
  );
})('Choose trip that does not match the voucher, verify message, add new travelers', async () => {
  if ((await getWindowWidth()) < 970) {
    console.warn('This test is not run on mobile or tablet device');
  } else {
    const url = getSiteUrl('supersaver-se', config.host);
    const newTravelers = addNumberToTraveler([
      getThirdAdult(),
      getFourthAdult(),
      getSecondChild(),
      getSecondInfant(),
    ]);
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow(url);
    await t.expect(startModule.startPageSearchForm.visible).ok();
    await makeSearch('one way trip', origin, destination, [20]);

    await t
      .click(resultModule.toggleFilterButton)
      .click(resultModule.clearAirlines)
      .click(resultModule.filterAirlineTurkishCheckbox)
      .click(resultModule.toggleFilterButton);
    await selectTripButtonByIndex(0);

    await t.expect(travelerDetailsModule.voucherNotValidInfo.visible).ok();

    await addContact(travelers[0]);
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
    await payWithDummyBank();
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
});
