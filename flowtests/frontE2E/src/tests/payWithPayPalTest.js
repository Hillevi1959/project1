import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addAllExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { checkPaymentConditions } from '../../../common/src/rf_pages/payment';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import getPaymentData from '../../../common/src/util/paymentData';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const url = getSiteUrl('supersaver-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'payment.provider.wallet': 'Checkout',
  'Payment.provider.wallet.PayPal': 'Checkout',
  'Payment.Wallets': 'PayPal',
  'Payment.PayPal.NameFields.Enabled': true,
  // 'Payment.FraudAssessment.Accertify.ShadowMode': true,
};

fixture('Pay order with PayPal')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Search trip, book all products, pay with PayPal', async () => {
  const numberOfAdults = 2;

  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON');
  await addTravelerInformation(travelers);
  await addAllExtraProducts(numberOfAdults, travelers);
  await bookFlight();
  await closeSeatMapModal();

  const user = 'sb-9pdvk3524496@personal.example.com';
  const pwd = 'g!558@WI';
  await t.click(paymentModule.payPalLabel);
  const paymentData = getPaymentData();
  await scrollToElement('[data-testid="paypal-payment-form"] [data-testid="firstName-input"]');
  await t.typeText(paymentModule.payPalFirstName, paymentData.firstName);
  await t.typeText(paymentModule.payPalLastName, paymentData.lastName);
  await scrollToElement('[data-testid="paypal-payment-form"] [data-testid="street-input"]');
  await t.typeText(paymentModule.payPalStreet, paymentData.street);
  await t.typeText(paymentModule.payPalZipcode, paymentData.zipCode);
  await scrollToElement('[data-testid="paypal-payment-form"] [data-testid="city-input"]');
  await t.typeText(paymentModule.payPalCity, paymentData.city);
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
  await t.expect(paymentModule.payPalEmailLogin.visible).ok();
  await t.typeText(paymentModule.payPalEmailLogin, user).click(paymentModule.payPalNextButton);
  await t.expect(paymentModule.payPalPassword.visible).ok();
  await t.typeText(paymentModule.payPalPassword, pwd).click(paymentModule.payPalLoginButton);
  await t.expect(paymentModule.payPalPaymentOptions.visible).ok();
  await t.click(paymentModule.payPalPayButton);

  await waitForOrderPageToLoad();
  // Text will be changed later and applicable to PayPal
  await t
    .expect(orderModule.paymentMethod.innerText)
    .contains('Payment method: Wallet (Apple Pay)');
});
