import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  addCheckoutData,
  checkPaymentConditions,
  payWithCreditCard,
} from '../../../common/src/rf_pages/payment';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const url = getSiteUrl('supersaver-se', config.host);
const travelers = addNumberToTraveler([getFirstAdult()]);
const props = {
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.FirstPaymentMethod.Open.Enabled': true,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
  'Payment.RemoveAdressForBank.Enable': false,
};
const numberOfAdults = 1;
const numberOfInfants = 0;

fixture('Payment page verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('First payment option opened at start, fee and logos are displayed', async () => {
  await searchAndSelectTrip(
    numberOfAdults,
    0,
    numberOfInfants,
    'return trip',
    'Stockholm',
    'London',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 30000 });

  // Verify fee
  await t
    .expect(paymentModule.bankFee.visible)
    .ok()
    .expect(paymentModule.cardFee.visible)
    .ok()
    .expect(paymentModule.klarnaSliceFee.visible)
    .ok()
    .expect(paymentModule.klarnaPayLaterFee.visible)
    .ok();

  // Verify logos
  await t
    .expect(paymentModule.trustlyLogo.visible)
    .ok()
    .expect(paymentModule.cardLogo.visible)
    .ok()
    .expect(paymentModule.klarnaLogo.count)
    .eql(2);

  // Verify bank option opened (first payment option)
  await scrollToElement('[data-testid="bank-payment-form"] [data-testid="firstName-input"]');
  await t.expect(paymentModule.bankFirstNameInput.visible).ok();
  // Verify other payment options can be selected
  await scrollToElement('[for="CARD"]');
  await t.click(paymentModule.cardLabel);
  await t.expect(paymentModule.cardFirstNameInput.visible).ok();
  await scrollToElement('[for="KlarnaSliceIt"]');
  await t.click(paymentModule.klarnaSliceLabel);
  await t.expect(paymentModule.klarnaSliceRadiobutton.checked).eql(true);
  await scrollToElement('[for="KlarnaPayLater"]');
  await t.click(paymentModule.klarnaPayLaterLabel);
  await t.expect(paymentModule.klarnaPayLaterRadiobutton().checked).eql(true);

  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('Pay with dummy bank with bank option opened and no address field', async () => {
  const bankprop = {
    'Payment.RemoveAdressForBank.Enable': true,
  };
  await setProps(bankprop);
  await setIBEDummyPaymentBankOn();
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'Stockholm', 'London', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('Remove address field from bank payment option', async () => {
  const bankprop = {
    'Payment.RemoveAdressForBank.Enable': true,
  };
  await setProps(bankprop);
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'Stockholm', 'London', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  await t.expect(paymentModule.bankAddressFieldContainer.visible).notOk();
});
