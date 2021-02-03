import { t } from 'testcafe';
import paymentModule from '../rf_modules/paymentModule';
import getPaymentData from '../util/paymentData';
import { scrollToElement } from '../util/clientFunction';
import { checkPaymentConditions } from './payment';

export async function enterPayPalCustomerInfo() {
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
}

export async function logInAndPayWithPayPal() {
  const user = 'sb-9pdvk3524496@personal.example.com';
  const pwd = 'g!558@WI';

  await t.expect(paymentModule.payPalEmailLogin.visible).ok();
  await t.typeText(paymentModule.payPalEmailLogin, user).click(paymentModule.payPalNextButton);
  await t.expect(paymentModule.payPalPassword.visible).ok();
  await t.typeText(paymentModule.payPalPassword, pwd).click(paymentModule.payPalLoginButton);
  await t.expect(paymentModule.payPalPaymentOptions.visible).ok();
  await t.click(paymentModule.payPalPayButton);
}
