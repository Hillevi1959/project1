import { Selector, t } from 'testcafe';
import paymentModule from '../rf_modules/paymentModule';
import getPaymentData from '../util/paymentData';
import { scrollToElement } from '../util/clientFunction';
import { isDesktop, isMobile, isTablet } from '../util/device';
import { getNumberOfElements } from '../util/common';
// import { getSiteUrl } from '../util/common';
// import config from '../../testdata.json';

export async function checkPaymentConditions() {
  if (await paymentModule.checkPaymentConditions.visible) {
    await scrollToElement('[data-testid="payment-conditions-input"]');
    await t.click(paymentModule.checkPaymentConditions);
  }
}

export async function openCartIfClosed() {
  if (await isDesktop()) {
    if (!(await paymentModule.cartFlightContent.visible)) {
      await t.click(paymentModule.toggleCartButton);
    }
  }
}

export async function payWithDummyBank(traveler) {
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 30000 });
  await scrollToElement('[for="BANK"]');
  await t.click(paymentModule.bankLabel);
  await scrollToElement('[data-testid="bank-payment-form"] [data-testid="firstName-input"]');
  await t.typeText(paymentModule.bankFirstNameInput, traveler.firstName);
  await t.typeText(paymentModule.bankLastNameInput, traveler.lastName);
  await scrollToElement('[data-testid="bank-payment-form"] [data-testid="street-input"]');
  await t.typeText(paymentModule.bankStreetInput, traveler.street);
  await t.typeText(paymentModule.bankZipCodeInput, traveler.zipCode);
  await t.typeText(paymentModule.bankCityInput, traveler.city);
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
}

// eslint-disable-next-line consistent-return
export async function getBaggagePricePayment() {
  if ((await isMobile()) || (await isTablet())) {
    await t.expect(paymentModule.checkinBaggagePriceMobile.exists).ok();
    const priceText = await paymentModule.checkinBaggagePriceMobile.innerText;
    const indexStart = 1;
    const indexEnd = priceText.search(' SEK');
    const price = priceText.substring(indexStart, indexEnd);
    return parseInt(price.replace(/\s+/g, ''), 10);
  }
  if (await isDesktop()) {
    await t.expect(paymentModule.checkinBaggagePrice.exists).ok();
    const priceText = await paymentModule.checkinBaggagePrice.innerText;
    const indexStart = 1;
    const indexEnd = priceText.search(' SEK');
    const price = priceText.substring(indexStart, indexEnd);
    return parseInt(price.replace(/\s+/g, ''), 10);
  }
}

export async function addPaymentData() {
  const paymentData = getPaymentData();
  await t.typeText(paymentModule.cardNumberInput, paymentData.cardNumber);
  await t.typeText(paymentModule.cardExpInput, paymentData.exp);
  await t.typeText(paymentModule.cardCvcInput, paymentData.cvc);
  await t.typeText(paymentModule.cardFirstNameInput, paymentData.firstName);
  await t.typeText(paymentModule.cardLastNameInput, paymentData.lastName);
}

export async function acceptPriceChange() {
  if (!(await Selector('[data-testid="order-page"]', { timeout: 30000 }).visible)) {
    if (
      await getNumberOfElements('.ReactModal__Content.ReactModal__Content--after-open.etiModal' > 0)
    ) {
      await t.click(paymentModule.priceChangeYesButton.nth(0));
    }
  }
}

export async function payWithCreditCard() {
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 30000 });
  await scrollToElement('[for="CARD"]');
  await t.click(paymentModule.cardLabel);
  await openCartIfClosed();
  await addPaymentData();
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
}

export function travelerNamesAsString(travelers) {
  return `${travelers[0].firstName} ${travelers[0].lastName} ${travelers[1].firstName} ${travelers[1].lastName} ${travelers[2].firstName} ${travelers[2].lastName} ${travelers[3].firstName} ${travelers[3].lastName}`;
}

export async function logInToCheckoutAndChangeUrl() {
  await t
    .switchToIframe(paymentModule.checkoutIFrame)
    .typeText(paymentModule.checkoutPassword, 'Checkout1!')
    .click(paymentModule.checkoutContinueButton)
    .switchToMainWindow();
}
