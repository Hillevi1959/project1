import { Selector } from 'testcafe';

export default {
  // TravelerDetails page
  airHelpComponent: Selector('[data-testid="airHelp-container"]'),
  airHelpYes: Selector('[data-testid="airHelp--true"]'),
  baggageInsuranceComboGeniusButtonYes: Selector(
    '[data-testid="baggageInsuranceComboCoverGenius--true"]',
  ),
  baggageInsuranceComboGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-baggageInsuranceComboCoverGenius-InsuranceProduct"]',
  ),
  bankruptcyInsuranceGeniusButtonYes: Selector(
    '[data-testid="bankruptcyInsuranceCoverGenius--true"]',
  ),
  bankruptcyInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-bankruptcyInsuranceCoverGenius-InsuranceProduct"]',
  ),
  cartAddedExtraProducts: Selector('#etiAccordionPanel-contentaddedExtraProducts li'),
  cartAllExtraProductsTdPage: Selector('[data-testid="sideBarWidget-list"] li'),
  cartBaggageInsuranceComboCoverGeniusIcon: Selector(
    '[data-testid="baggageInsuranceComboCoverGenius-ProductIcon"]',
  ),
  cartBankruptcyInsuranceCoverGeniusIcon: Selector(
    '[data-testid="bankruptcyInsuranceCoverGenius-ProductIcon"]',
  ),
  cartContentExistingExtraProducts: Selector(
    '#etiAccordionPanel-contentextraProducts [data-testid="sideBarWidget-list"] li',
  ),
  cartOpenProductsButton: Selector('#etiAccordionPanel-headerextraProducts > div > h3'),
  cartSeatMapIcon: Selector('[data-testid="seatMap-ProductIcon"]'),
  checkinBaggageYesAllPassengers: Selector('[data-testid="checkInBaggage-toggleTravelers-true"]'),
  checkInBaggageYesOnePassenger: Selector('[data-testid="checkInBaggage-travelerModule-0-true"]'),
  checkInBaggageComponent: Selector('[data-testid="checkInBaggage-container"]'),
  goToPayButton: Selector('[data-testid="postbookingProducts-payButton-Button"]'),
  onlineCheckinBaggageYes: Selector('[data-testid="onlineCheckIn--true"]'),
  onLineCheckinBaggageComponent: Selector('[data-testid="onlineCheckIn-container"]'),
  postBookingPage: Selector('#extraProductsForm'),
  seatMapComponent: Selector('[data-testid="seatMap-container"]'),
  seatMapYesButton: Selector('[data-testid="seatMap--true"]'),
  smsComponent: Selector('[data-testid="sms-container"]'),
  smsYesButton: Selector('[data-testid="sms--true"]'),
  supportPackageBasicStringSelector: '[for="choice.supportPackage.0"] .etiCustomRadio',
  supportPackageComponent: Selector('[data-testid="servicePackage-component"]'),
  supportPackagePlatinum: Selector('[for="choice.supportPackage.5001"]'),
  supportPackagePlatinumMobile: Selector('[for="toggleChoice.supportPackage.5001"]'),
  supportPackagePremium: Selector('[for="choice.supportPackage.62"]'),
  supportPackagePremiumMobile: Selector('[for="toggleChoice.supportPackage.62"]'),
  travelInsuranceComponent: Selector('[data-testid="travelInsuranceInsideEu-container"]'),
  travelInsuranceInEuYes: Selector('[data-testid="travelInsuranceInsideEu--true"]'),
  travelInsuranceModalYes: Selector('[data-testid="travelInsuranceInsideEuModal-confirm-button"]'),
  // Payment page
  cardLabel: Selector('[data-testid="paymentMethods-CARD-label"]'),
  cardNumber: Selector('[data-testid="cardnumber-input"]'),
  cartContentPayment: Selector('[data-testid="cart-content-Content"]'),
  cartExtraProductsPayment: Selector('[data-testid="cart-content-Content"] li'),
  ccExpInput: Selector('[data-testid="cc-exp-input"]'),
  conditions: Selector('#conditions'),
  cvvInput: Selector('[data-testid="cvc-input"]'),
  firstName: Selector('[data-testid="firstName-input"]'),
  lastName: Selector('[data-testid="lastName-input"]'),
  payPostBookingButton: Selector('[data-testid="payment-pay-button"]'),
  // Order page
  orderNumber: Selector('[data-testid="orderPage-ReceiptInformation-orderNumber"]'),
  // Log in page
  postBookingEmail: Selector('[data-testid="etiTextInput-label"]').nth(0),
  postBookingLogIn: Selector('[data-testid="login-button"]'),
  postBookingOrderNumber: Selector('[data-testid="etiTextInput-label"]').nth(1),
};
