import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import {
  addNoExtraProducts,
  addSupportPackagePremiumNew,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import { messageUk } from '../../../common/src/rf_pages/order';
import {
  addPaymentData,
  checkPaymentConditions,
  openCartIfClosed,
} from '../../../common/src/rf_pages/payment';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import config from './testdata.json';

const url = getSiteUrl('test-uk', config.host);

const props = {
  'Feature.NewResponsive.Enabled': true,
  'IbeClient.Products.SupportPackage.Bundling.Enabled': true,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'AB.Responsive.SupportPackage.NewDesign.Enabled': true,
};

fixture('Support Package verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Book and pay for a trip with bundled support package', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  await searchAndSelectTrip(travelers.length, 0, 0, 'return trip', 'STO', 'LON', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);

  await t
    .expect(travelerDetailsModule.supportPackageMobileTravelPlan.exists)
    .ok()
    .expect(travelerDetailsModule.supportPackageOnlineCheckIn.exists)
    .ok()
    .expect(travelerDetailsModule.mobileTravelPlanContainer.visible)
    .notOk()
    .expect(travelerDetailsModule.smsContainer.visible)
    .notOk()
    .expect(travelerDetailsModule.onlineCheckinBaggageContainer.visible)
    .notOk();

  await addNoExtraProducts(travelers.length, travelers);
  await addSupportPackagePremiumNew();

  await t
    .expect(travelerDetailsModule.cartSupportPackageProduct.exists)
    .ok()
    .expect(travelerDetailsModule.cartCheckInProduct.exists)
    .ok()
    .expect(travelerDetailsModule.cartMobileTravelPlanProduct.exists)
    .ok()
    .expect(travelerDetailsModule.cartSmsProduct.exists)
    .ok();

  await bookFlight();
  await closeSeatMapModal();
  await t.click(paymentModule.cardLabel);
  await t.expect(paymentModule.cardPaymentForm.exists).ok('', { timeout: 90000 });

  await openCartIfClosed();

  await t
    .expect(paymentModule.cartSupportPackageProduct.visible)
    .ok()
    .expect(paymentModule.cartMobileTravelPlanProduct.visible)
    .ok()
    .expect(paymentModule.cartSmsProduct.visible)
    .ok()
    .expect(paymentModule.cartCheckInProduct.visible)
    .ok();

  await addPaymentData();
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);

  await t
    .expect(orderModule.infoTextOrderPage.visible)
    .ok('', { timeout: 90000 })
    .expect(orderModule.infoTextOrderPage.innerText)
    .contains(messageUk)
    .expect(paymentModule.cartSupportPackageProduct.visible)
    .ok()
    .expect(paymentModule.cartMobileTravelPlanProduct.visible)
    .ok()
    .expect(paymentModule.cartSmsProduct.visible)
    .ok()
    .expect(paymentModule.cartCheckInProduct.visible)
    .ok();
});
