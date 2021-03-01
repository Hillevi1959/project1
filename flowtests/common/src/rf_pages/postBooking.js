import { t } from 'testcafe';
import postbookingModule from '../rf_modules/postbookingModule';
import getPaymentData from '../util/paymentData';
import paymentModule from '../rf_modules/paymentModule';
import { checkPaymentConditions } from './payment';

export async function logInToPostBooking(email, orderNumber) {
  await t.typeText(postbookingModule.postBookingEmail, email);
  await t.typeText(postbookingModule.postBookingOrderNumber, orderNumber);
  await t.click(postbookingModule.postBookingLogIn);
}

export async function fillInPaymentinfo() {
  const paymentData = getPaymentData();
  await t.typeText(postbookingModule.cardNumber, paymentData.cardNumber);
  await t.typeText(postbookingModule.ccExpInput, paymentData.exp);
  await t.typeText(postbookingModule.cvvInput, paymentData.cvc);
  await t.typeText(postbookingModule.firstName, paymentData.firstName);
  await t.typeText(postbookingModule.lastName, paymentData.lastName);
  await t.click(postbookingModule.conditions);
}

export async function payPostbooking() {
  const paymentData = getPaymentData();
  await t.click(postbookingModule.cardLabel);
  await t.typeText(postbookingModule.cardNumber, paymentData.cardNumber);
  await t.typeText(postbookingModule.ccExpInput, paymentData.exp);
  await t.typeText(postbookingModule.cvvInput, paymentData.cvc);
  await t.typeText(postbookingModule.firstName, paymentData.firstName);
  await t.typeText(postbookingModule.lastName, paymentData.lastName);
  await t.click(postbookingModule.conditions);
  await t.click(postbookingModule.payPostBookingButton);
}

export async function payWithDummyBankPostBooking() {
  const paymentData = getPaymentData();
  await t.expect(paymentModule.paymentContainer.exists).ok('', { timeout: 10000 });
  await t.click(paymentModule.bankLabel);
  await t.click(paymentModule.bankFirstNameInput);
  await t.typeText(paymentModule.bankFirstNameInput, paymentData.firstName);
  await t.typeText(paymentModule.bankLastNameInput, paymentData.lastName);
  await t.typeText(paymentModule.bankStreetInput, paymentData.street);
  await t.typeText(paymentModule.bankZipCodeInput, paymentData.zipCode);
  await t.typeText(paymentModule.bankCityInput, paymentData.city);
  await checkPaymentConditions();
  await t.click(paymentModule.payButton);
}
