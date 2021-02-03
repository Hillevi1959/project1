import { t } from 'testcafe';
import { acceptCookies, clearField, getSiteUrl } from '../../../common/src/util/common';
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
import { scrollToElement } from '../../../common/src/util/clientFunction';
import { isMobile, isTablet } from '../../../common/src/util/device';

const travelers = addNumberToTraveler([getFirstAdult()]);
const props = {
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
  'Payment.RemoveAdressForBank.Enable': false,
};
const numberOfAdults = 1;

fixture('Conditional textkey on payment page');

test.before(async () => {
  const url = getSiteUrl('gotogate-de', config.host);
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Verify fee and no fee text on payment page', async () => {
  const masterCardNumber = '5555 4444 3333 1111';
  const visaCardNumber = '4111 1111 1111 1111';
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'Stockholm', 'London', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 30000 });
  await t.click(paymentModule.cardLabel);
  await scrollToElement('[data-testid="card-payment-form"] [data-testid="cardnumber-input"]');
  await t.typeText(paymentModule.cardNumberInput, masterCardNumber);

  if ((await isMobile()) || (await isTablet())) {
    await t
      .expect(paymentModule.cartDiscountOrFeePrice.innerText)
      .contains('Payment fees: (MASTERCARD Debit)');
  } else {
    await t
      .expect(paymentModule.bottomContentPriceSummaryFeeDiscountText.nth(1).innerText)
      .contains('Payment fees: (MASTERCARD Debit)');
  }

  await clearField(paymentModule.cardNumberInput);
  await t.typeText(paymentModule.cardNumberInput, visaCardNumber);

  if ((await isMobile()) || (await isTablet())) {
    await t.expect(paymentModule.cartDiscountOrFeePrice.count).eql(0);
  } else {
    await t.expect(paymentModule.bottomContentPriceSummaryFeeDiscountText.count).eql(2);
  }

  await scrollToElement('[data-testid="paymentMethods-BANK-label"]');
  await t.click(paymentModule.bankLabel);

  await t.expect(paymentModule.cartDiscountOrFeePrice.innerText).contains('Payment fees: (Sofort)');
});

test.before(async () => {
  const urlSe = getSiteUrl('supersaver-se', config.host);
  await t.navigateTo(urlSe);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setIBEDummyPaymentBankOn();
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Verify discount text for bank option', async () => {
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'Stockholm', 'London', 'ECONOMY', [
    11,
    24,
  ]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 30000 });
  await t.click(paymentModule.bankLabel);

  if ((await isMobile()) || (await isTablet())) {
    await t
      .expect(paymentModule.cartDiscountOrFeePrice.innerText)
      .contains('Rabatterat pris vid betalning via internetbank (IBE Dummy Payment)');
  } else {
    await t
      .expect(paymentModule.bottomContentPriceSummaryFeeDiscountText.nth(1).innerText)
      .contains('Rabatterat pris vid betalning via internetbank (IBE Dummy Payment)');
  }
});
