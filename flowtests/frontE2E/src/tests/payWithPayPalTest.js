import { Selector, t } from 'testcafe';
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
import edvinModule from '../../../common/src/rf_modules/edvinModule';

const url = getSiteUrl('supersaver-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'payment.provider.wallet': 'Checkout',
  'Payment.Wallets': 'PayPal',
  'Payment.provider.wallet.PayPal': 'Checkout', // finns inte definierad
  'Payment.PayPal.NameFields.Enabled': true, // finns inte definierad ännu
};

/* This is a temporary solution to creat props in Edvin until they are
created in production and can be set in test as session properties */
async function createPaypalPropsInEdvin() {
  const keyName = Selector('[name="keyName"]');
  const keyValue = Selector('[name="value"]');
  const addPropCheckbox = Selector('[name="save"]');
  const searchButton = Selector('[name="__submit"]');
  const groupNameInput = Selector('[name="groupName"]');
  await t
    .navigateTo(`http://supersaver-uk${config.host}/edvin`)
    .typeText(edvinModule.userNameInput, 'autotest')
    .typeText(edvinModule.passwordInput, 'gurkburk')
    .click(edvinModule.logInButton)
    .navigateTo(
      `http://supersaver-uk${config.host}/edvin/dbproperty/DBPropertyValue.list.action?_s=true&search=false`,
    );
  await t
    .typeText(keyName, 'Payment.provider.wallet.PayPal')
    .typeText(keyValue, 'Checkout')
    .typeText(groupNameInput, 'ibe')
    .click(addPropCheckbox)
    .click(searchButton);
  await t
    .click(keyName)
    .pressKey('ctrl+a delete')
    .typeText(keyName, 'Payment.PayPal.NameFields.Enabled')
    .click(keyValue())
    .pressKey('ctrl+a delete')
    .typeText(keyValue, 'true')
    .click(addPropCheckbox)
    .click(searchButton);
}

// The payment service provider is set up for Paypal on supersaver-uk
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

  await createPaypalPropsInEdvin();
  await t.navigateTo(url);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON');
  await addTravelerInformation(travelers);
  await addAllExtraProducts(numberOfAdults, travelers);
  await bookFlight();
  await closeSeatMapModal();

  const user = 'sb-9pdvk3524496@personal.example.com';
  const pwd = 'g!558@WI';
  await t
    .expect(paymentModule.payPalLabel.visible)
    .ok()
    .click(paymentModule.payPalLabel);
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
