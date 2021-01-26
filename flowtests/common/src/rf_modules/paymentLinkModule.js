import { Selector } from 'testcafe';

export default {
  cardCvcInput: Selector('[data-testid="cvc-input"]'),
  cardExpInput: Selector('[data-testid="cc-exp-input"]'),
  cardFirstNameInput: Selector('[data-testid="firstName-input"]'),
  cardLastNameInput: Selector('[data-testid="lastName-input"]'),
  cardNumberInput: Selector('[data-testid="cardnumber-input"]'),
  checkInProduct: Selector('[data-testid="cart-product-onlineCheckIn-price"]'),
  checkPaymentConditions: Selector('[data-testid="payment-conditions-input"]'),
  flightUpdatesBySmsProduct: Selector('[data-testid="cart-product-mobileTravelPlan-price"]'),
  payButton: Selector('[data-testid="payment-pay-button"]'),
  paymentLinkPage: Selector(
    '[data-testid="paymentPage-paymentMethodsAndCart-intersectionWrapper"]',
  ),
  travelDocumentsByPostProduct: Selector('[data-testid="cart-product-travelDocsPost-price"]'),
};
