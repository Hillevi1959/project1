/* eslint-disable consistent-return */
/* eslint-disable no-console */
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
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import {
  enterPayPalCustomerInfo,
  logInAndPayWithPayPal,
} from '../../../common/src/rf_pages/payPalPayment';

const url = getSiteUrl('supersaver-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'payment.provider.wallet': 'Checkout',
  'Payment.Wallets': 'PayPal',
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.provider.wallet.PayPal': 'Checkout',
  'Payment.PayPal.NameFields.Enabled': true,
};

// The payment service provider is set up for Paypal on supersaver-uk
fixture('Pay order with PayPal')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await closeHeaderUrgencyBanner();
    await setProps(props);
  });

test('Search trip, book all products, pay with PayPal', async () => {
  const numberOfAdults = 2;
  await t.navigateTo(url);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addAllExtraProducts(numberOfAdults, travelers);
  await bookFlight();
  await closeSeatMapModal();

  await enterPayPalCustomerInfo();
  await logInAndPayWithPayPal();

  await waitForOrderPageToLoad();
  // Text will be changed later and applicable to PayPal
  await t
    .expect(orderModule.paymentMethod.innerText)
    .contains('Payment method: Wallet (Apple Pay / Paypal)');
});
