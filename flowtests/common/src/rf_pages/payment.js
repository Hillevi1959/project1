/* eslint-disable no-console */
import { Selector, t } from 'testcafe';
import paymentModule from '../rf_modules/paymentModule';
import getPaymentData from '../util/paymentData';
import { scrollToElement } from '../util/clientFunction';
import { isDesktop, isMobile, isTablet } from '../util/device';

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

export async function payWithDummyBank() {
  const paymentData = getPaymentData();
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 10000 });
  await scrollToElement('[for="BANK"]');
  await t.click(paymentModule.bankLabel);
  await scrollToElement('[data-testid="bank-payment-form"] [data-testid="firstName-input"]');
  await t.typeText(paymentModule.bankFirstNameInput, paymentData.firstName);
  await t.typeText(paymentModule.bankLastNameInput, paymentData.lastName);
  await scrollToElement('[data-testid="bank-payment-form"] [data-testid="street-input"]');
  await t.typeText(paymentModule.bankStreetInput, paymentData.street);
  await t.typeText(paymentModule.bankZipCodeInput, paymentData.zipCode);
  await t.typeText(paymentModule.bankCityInput, paymentData.city);
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
  await scrollToElement('[data-testid="card-payment-form"] [data-testid="cardnumber-input"]');
  await t.typeText(paymentModule.cardNumberInput, paymentData.cardNumber);
  await scrollToElement('[data-testid="card-payment-form"] [data-testid="cc-exp-input"]');
  await t.typeText(paymentModule.cardExpInput, paymentData.exp);
  await t.typeText(paymentModule.cardCvcInput, paymentData.cvc);
  await scrollToElement('[data-testid="card-payment-form"] [data-testid="firstName-input"]');
  await t.typeText(paymentModule.cardFirstNameInput, paymentData.firstName);
  await scrollToElement('[data-testid="card-payment-form"] [data-testid="lastName-input"]');
  await t.typeText(paymentModule.cardLastNameInput, paymentData.lastName);
}

export async function acceptPriceChange() {
  if (
    !(await Selector('[data-testid="order-page"]', { timeout: 30000 }).visible) ||
    !(await Selector('[data-testid="image-panel"]', { timeout: 30000 }).visible)
  ) {
    if (await paymentModule.priceChangeModal.visible) {
      console.log('Payment change visible');
      await t.click(paymentModule.priceChangeYesButton.nth(0));
    }
  }
}

export async function payWithCreditCard() {
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 10000 });
  await t.click(paymentModule.cardLabel);
  await openCartIfClosed();
  await addPaymentData();
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
}

export function travelerNamesAsString(travelers) {
  return `${travelers[0].firstName} ${travelers[0].lastName} ${travelers[1].firstName} ${travelers[1].lastName} ${travelers[2].firstName} ${travelers[2].lastName} ${travelers[3].firstName} ${travelers[3].lastName}`;
}

export async function addCheckoutData() {
  await t.expect(paymentModule.checkoutIFrame.visible).ok({ timeout: 20000 });
  await t
    .switchToIframe(paymentModule.checkoutIFrame)
    .typeText(paymentModule.checkoutPassword, 'Checkout1!')
    .click(paymentModule.checkoutContinueButton)
    .switchToMainWindow();
}
