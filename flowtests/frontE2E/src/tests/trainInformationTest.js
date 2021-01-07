import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import { addTravelerInformation, toggleCart } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import reviewModule from '../../../common/src/rf_modules/reviewModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { openCartIfClosed, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'IbeClient.TravelerDetails.Modal': 'REVIEW',
  'PaymentService.CascadingPaymentsBehavior.Enabled': false,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
};
const numberOfAdults = 2;

fixture('Verify train icons and information in booking flow')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Train icons and change to train information visible on all pages', async () => {
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'Uppsala', [11, 24]);
  await t.click(resultModule.tripDetailBound.nth(0));

  // Verify on result page
  await t.expect(resultModule.planeTrainStandardIcon.visible).ok();
  await t.expect(resultModule.firstBoundPlaneIcon.visible).ok();
  await t.expect(resultModule.secondBoundTrainIcon.visible).ok();
  await t.expect(resultModule.trainSegmentIcon.visible).ok();

  await selectTripButtonByIndex(0);
  // Verify on TD-page
  await t.click(travelerDetailsModule.tripDetailsArrow);

  await t.expect(travelerDetailsModule.smallIcons.count).gt(2);
  await t.expect(travelerDetailsModule.firstBoundPlaneIcon.visible).ok();
  await t.expect(travelerDetailsModule.secondBoundTrainIcon.visible).ok();
  await t.expect(travelerDetailsModule.trainSegmentIcon.visible).ok();
  await t.expect(travelerDetailsModule.cartTagIcon.visible).ok();

  await t.click(travelerDetailsModule.tripDetailsArrow);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await t.click(travelerDetailsModule.proceedToReviewButton);

  // Verify on review page
  await t.expect(reviewModule.firstBoundPlaneIcon.visible).ok();
  await t.expect(reviewModule.secondBoundTrainIcon.visible).ok();

  await t.click(reviewModule.bookNowModalButton);

  // Verify on payment page
  await t.click(paymentModule.tripDetailsToggleButton);

  await t.expect(paymentModule.smallIcons.count).gt(2);
  await t.expect(paymentModule.firstBoundPlaneIcon.visible).ok();
  await t.expect(paymentModule.secondBoundTrainIcon.visible).ok();
  await t.expect(paymentModule.trainSegmentIcon.visible).ok();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerDetailsModule.cartTagIcon.visible).ok();
    await toggleCart();
  } else if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(travelerDetailsModule.cartTagIcon.visible).ok();
  }
  await t.click(paymentModule.tripDetailsToggleButton);
  await payWithCreditCard();

  // verify on order page
  await waitForOrderPageToLoad();

  await t.expect(orderModule.firstBoundPlaneIcon.visible).ok();
  await t.expect(orderModule.secondBoundTrainIcon.visible).ok();

  await t.click(orderModule.flightInfoButton);

  await t.expect(orderModule.firstBoundPlaneIcon.visible).ok();
  await t.expect(orderModule.secondBoundTrainIcon.visible).ok();
  await t.expect(orderModule.cartTagIcon.visible).ok();
});
