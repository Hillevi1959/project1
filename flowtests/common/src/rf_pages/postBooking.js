import { t } from 'testcafe';
import postbookingModule from '../rf_modules/postbookingModule';
import getPaymentData from '../util/paymentData';

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

export async function toggleCartPostBooking() {
  await t.click(postbookingModule.cartToggleButtonMobilePostBooking);
}
