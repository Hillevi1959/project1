import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const site = 'gotogate-au-nustay';
const url = getSiteUrl(site, config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'Payment.CreditCardInput.BinVerification': 'FullBin',
  'Payment.CreditCardInput.BinVerification.Enabled': true,
};

async function selectTripAddNoProductsGoToPaymentPage() {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  const numberOfAdults = 1;

  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults, site);
  await bookFlight();
}

fixture('Verify fullbin functionality on payment page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
    await selectTripAddNoProductsGoToPaymentPage();
  });

test('Add different card numbers', async () => {
  const masterCardNumber = '5555 4444 3333 1111';

  await scrollToElement('[for="CARD"]');
  await t.click(paymentModule.cardLabel);
  //  Card number not recognized
  await scrollToElement('[for="CARD"]');
  await t.click(paymentModule.cardLabel);
  await t.typeText(paymentModule.cardNumberInput, '99999999');
  await t.expect(paymentModule.cardInfoText.visible).ok();

  // Card not supported
  const dinersClubCard = '3600 666633 3344';
  await t
    .click(paymentModule.cardNumberInput)
    .pressKey('ctrl+a delete')
    .typeText(paymentModule.cardNumberInput, dinersClubCard);
  await t.expect(paymentModule.cardInfoText.visible).ok();

  // Add card number, correct icon displayed, fee in cart
  await t
    .click(paymentModule.cardNumberInput)
    .pressKey('ctrl+a delete')
    .typeText(paymentModule.cardNumberInput, masterCardNumber);
  await t
    .expect(paymentModule.cartCardFeeText.visible)
    .ok()
    .expect(paymentModule.cartCardFeeText.innerText)
    .contains('MASTERCARD');
});
