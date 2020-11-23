import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner } from '../../../common/src/rf_pages/start';
import { goToPostbookingFromOrderPage, messageUk } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import postbookingModule from '../../../common/src/rf_modules/postbookingModule';
import {
  clickGoToPayment,
  createOrderFlowWithNoProductsCardPayment,
} from '../../../common/src/rf_pages/postBookingProduct';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import config from './testdata.json';

const url = getSiteUrl('test-uk', config.host);

const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);

const props = {
  'Feature.NewResponsive.Enabled': true,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
};

fixture('Cover Genius products verification on postbooking')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Buy Cover Genius products on postbooking', async () => {
  await createOrderFlowWithNoProductsCardPayment(travelers);

  await t
    .expect(orderModule.infoTextOrderPage.visible)
    .ok('', { timeout: 90000 })
    .expect(orderModule.infoTextOrderPage.innerText)
    .contains(messageUk);

  await goToPostbookingFromOrderPage();

  await t.expect(postbookingModule.postBookingPage.exists).ok('', { timeout: 50000 });

  let hasBankruptcyInsurance = false;
  let hasBaggageInsuranceCombo = false;

  if (
    (await postbookingModule.baggageInsuranceComboGeniusContainer.exists) &&
    (await postbookingModule.baggageInsuranceComboGeniusContainer.visible)
  ) {
    await t
      .click(postbookingModule.baggageInsuranceComboGeniusButtonYes)
      .expect(postbookingModule.cartBaggageInsuranceComboCoverGeniusIcon.exists)
      .ok();

    hasBaggageInsuranceCombo = true;
  }

  if (
    (await postbookingModule.bankruptcyInsuranceGeniusContainer.exists) &&
    (await postbookingModule.bankruptcyInsuranceGeniusContainer.visible)
  ) {
    await t
      .click(postbookingModule.bankruptcyInsuranceGeniusButtonYes)
      .expect(postbookingModule.cartBankruptcyInsuranceCoverGeniusIcon.exists)
      .ok();

    hasBankruptcyInsurance = true;
  }

  if (hasBaggageInsuranceCombo || hasBankruptcyInsurance) {
    await clickGoToPayment();

    await t.expect(postbookingModule.cartExtraProductsPayment.exists).ok('', { timeout: 50000 });

    if (hasBankruptcyInsurance) {
      await t.expect(postbookingModule.cartBankruptcyInsuranceCoverGeniusIcon.exists).ok();
    }

    if (hasBaggageInsuranceCombo) {
      await t.expect(postbookingModule.cartBaggageInsuranceComboCoverGeniusIcon.exists).ok();
    }
  }
});
