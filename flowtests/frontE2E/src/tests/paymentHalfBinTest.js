import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import config from '../../testdata.json';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const site = 'gotogate-au-nustay';
const url = getSiteUrl(site, config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'Payment.CreditCardInput.BinVerification': 'HalfBin',
  'Payment.CreditCardInput.BinVerification.Enabled': false,
};
const visaCardNumber = '4111 1111 1111 1111';
const masterCardNumber = '5555 4444 3333 1111';

async function selectTripAddNoProductsGoToPaymentPage() {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  const numberOfAdults = 1;
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults, site);
  await bookFlight();
}

fixture('Verify halfbin functionality on payment page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
    await selectTripAddNoProductsGoToPaymentPage();
  });

test('Different ways of selecting cards', async () => {
  // Selected card and card number match up, no fee in cart
  await scrollToElement('[for="CARD"]');
  await t.click(paymentModule.cardLabel);
  await t.click(paymentModule.cardVisa);
  await t.typeText(paymentModule.cardNumberInput, visaCardNumber);
  await t.expect(paymentModule.cartCardFeeText.exists).notOk();

  // All cards can be selected before number is entered
  await t.click(paymentModule.cardNumberInput).pressKey('ctrl+a delete');
  await t.click(paymentModule.cardVisa);
  await t.expect(paymentModule.cardRadioButtonVisa.checked).ok();
  await t.click(paymentModule.cardVisaDebit);
  await t.expect(paymentModule.cardRadioButtonVisaDebit.checked).ok();
  await t.click(paymentModule.cardVisaElectron);
  await t.expect(paymentModule.cardRadioButtonVisaElectron.checked).ok();
  await t.click(paymentModule.cardMasterCard);
  await t.expect(paymentModule.cardRadioButtonMasterCard.checked).ok();
  await t.click(paymentModule.cardMaestro);
  await t.expect(paymentModule.cardRadioButtonMaestro.checked).ok();
  await t.click(paymentModule.cardDebit);
  await t.expect(paymentModule.cardRadioButtonDebit.checked).ok();
  await t.click(paymentModule.cardAmericanExpress);
  await t.expect(paymentModule.cardRadioButtonAmericaExpress.checked).ok();

  // Card is automatically corrected when number is entered
  await t.click(paymentModule.cardVisa);
  await t.typeText(paymentModule.cardNumberInput, masterCardNumber);
  await t
    .expect(paymentModule.cardInfoText.visible)
    .ok()
    .expect(paymentModule.cartCardFeeText.exists)
    .ok()
    .expect(paymentModule.cartCardFeeText.innerText)
    .contains('MASTERCARD');

  // Card with lower fee cannot be selected when Mastercard number entered
  await scrollToElement('[data-testid="cvc-input"]');
  await t.click(paymentModule.cardNumberInput).pressKey('ctrl+a delete');
  await t
    .click(paymentModule.cardMasterCard)
    .typeText(paymentModule.cardNumberInput, masterCardNumber);
  await t
    .expect(paymentModule.cartCardFeeText.exists)
    .ok()
    .expect(paymentModule.cartCardFeeText.innerText)
    .contains('MASTERCARD');
  await t.click(paymentModule.cardVisa);
  await t.expect(paymentModule.cardRadioButtonVisa.checked).notOk();

  // Card with higher fee can be selected when Mastercard number is entered
  await t.click(paymentModule.cardMasterCard);
  await t
    .click(paymentModule.cardNumberInput)
    .pressKey('ctrl+a delete')
    .typeText(paymentModule.cardNumberInput, masterCardNumber);
  await t
    .expect(paymentModule.cartCardFeeText.exists)
    .ok()
    .expect(paymentModule.cartCardFeeText.innerText)
    .contains('MASTERCARD');
  await t.click(paymentModule.cardAmericanExpress);
  await t
    .expect(paymentModule.cardRadioButtonAmericaExpress.checked)
    .ok()
    .expect(paymentModule.cartCardFeeText.innerText)
    .contains('AMERICAN EXPRESS');
});
