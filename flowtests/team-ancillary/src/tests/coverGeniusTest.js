import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import orderModule from '../../../common/src/rf_modules/orderModule';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
} from '../../../common/src/util/travelerData';
import {
  addTravelerInformation,
  bookFlight,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import {
  addComprehensiveInsuranceGenius,
  addNoExtraProducts,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { openCartIfClosed, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import config from './testdata.json';

const url = getSiteUrl('supersaver-us', config.host);

const props = {
  'Feature.NewResponsive.Enabled': true,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Adyen',
};

fixture('Cover Genius products verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Buy Cover Genius Comprehensive product', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getFirstChild(), getFirstInfant()]);
  const numberOfAdults = 1;
  const numberOfChildren = 1;
  const numberOfInfants = 1;

  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'MAD',
    'BCN',
    'ECONOMY',
    [11, 24],
  );

  await t.expect(travelerDetailsModule.comprehensiveInsuranceGeniusContainer.visible).ok();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);

  await addComprehensiveInsuranceGenius();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerDetailsModule.cartComprehensiveInsuranceCoverGeniusProductMobile.visible)
      .ok();
    await toggleCart();
  }

  if (await isDesktop()) {
    await t
      .expect(travelerDetailsModule.comprehensiveInsuranceGeniusContainer.visible)
      .ok()
      .click(travelerDetailsModule.comprehensiveInsuranceGeniusButtonYes)
      .expect(travelerDetailsModule.cartComprehensiveInsuranceCoverGeniusProduct.visible)
      .ok();
  }

  await bookFlight();

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(paymentModule.cartComprehensiveInsuranceCoverGeniusProductMobile.visible).ok();
    await toggleCart();
  }
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cardLabel);
    await t.expect(paymentModule.cardPaymentForm.exists).ok('', { timeout: 90000 });
    await t.expect(paymentModule.cartComprehensiveInsuranceCoverGeniusProduct.visible).ok();
  }

  await payWithCreditCard();
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 90000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
  await t.expect(orderModule.cartComprehensiveInsuranceCoverGeniusProduct.visible).ok();
});
