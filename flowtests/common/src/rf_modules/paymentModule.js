import { Selector } from 'testcafe';

export default {
  bankAddressFieldContainer: Selector(
    '[data-testid="paymentPage-bankPaymentForm-addressFieldsContainer"]',
  ),
  bankCityInput: Selector('[data-testid="bank-payment-form"] [data-testid="city-input"]'),
  bankFee: Selector('[data-testid="payment-paymentMethodFee-label-BANK"]'),
  bankLabel: Selector('[data-testid="paymentMethods-BANK-label"]'),
  bankFirstNameInput: Selector('[data-testid="bank-payment-form"] [data-testid="firstName-input"]'),
  bankLastNameInput: Selector('[data-testid="bank-payment-form"] [data-testid="lastName-input"]'),
  bankStreetInput: Selector('[data-testid="bank-payment-form"] [data-testid="street-input"]'),
  bankZipCodeInput: Selector('[data-testid="bank-payment-form"] [data-testid="zipCode-input"]'),
  bottomContentPriceSummaryFeeDiscountText: Selector(
    '[data-testid="payment-bottomContent-priceSummary"] div',
  ),
  cabinClassInfo: Selector('[data-testid="tripDetails-segment-cabinClass"]'),
  cardAmericanExpress: Selector('[data-testid="payment-credit-cards"]').nth(6),
  cardCvcInput: Selector('[data-testid="card-payment-form"] [data-testid="cvc-input"]'),
  cardDebit: Selector('[data-testid="payment-credit-cards"]').nth(5),
  cardExpInput: Selector('[data-testid="card-payment-form"] [data-testid="cc-exp-input"]'),
  cardFee: Selector('[data-testid="payment-paymentMethodFee-label-CARD"]'),
  cardFirstNameInput: Selector('[data-testid="card-payment-form"] [data-testid="firstName-input"]'),
  cardInfoText: Selector('.etiNotification').nth(0),
  cardLabel: Selector('[for="CARD"]'),
  cardLogo: Selector('[data-testid="paymentMethodLogo-card"]'),
  cardLastNameInput: Selector('[data-testid="card-payment-form"] [data-testid="lastName-input"]'),
  cardMaestro: Selector('[data-testid="payment-credit-cards"]').nth(4),
  cardMasterCard: Selector('[data-testid="payment-credit-cards"]').nth(3),
  cardNumberInput: Selector('[data-testid="card-payment-form"] [data-testid="cardnumber-input"]'),
  cardPaymentForm: Selector('[data-testid="card-payment-form"]'),
  cardRadioButtonVisa: Selector('[data-testid="VISACreditCard-input"]'),
  cardRadioButtonVisaDebit: Selector('[data-testid="VISA DebitCreditCard-input"]'),
  cardRadioButtonVisaElectron: Selector('[data-testid="VISA ElectronCreditCard-input"]'),
  cardRadioButtonMasterCard: Selector('[data-testid="MASTERCARDCreditCard-input"]'),
  cardRadioButtonMaestro: Selector('[data-testid="MAESTROCreditCard-input"]'),
  cardRadioButtonDebit: Selector('[data-testid="MASTERCARD DebitCreditCard-input"]'),
  cardRadioButtonAmericaExpress: Selector('[data-testid="AMERICAN EXPRESSCreditCard-input"]'),
  cardVisa: Selector('[data-testid="payment-credit-cards"]').nth(0),
  cardVisaDebit: Selector('[data-testid="payment-credit-cards"]').nth(1),
  cardVisaElectron: Selector('[data-testid="payment-credit-cards"]').nth(2),
  cartAllInclusivePrice: Selector('[data-testid="cart-product-allInclusiveProtection-price"]'),
  cartAllInclusiveProduct: Selector('[data-testid="cart-product-allInclusiveProtection"]'),
  cartCancellationInsideEuProduct: Selector('[data-testid="cart-product-cancellationInsideEu"]'),
  cartCancellationInsideEuProductMobile: Selector(
    '[data-testid="cart-product-cancellationInsideEu-drawer"]',
  ),
  cartCancellationOutsideEuProductPrice: Selector(
    '[data-testid="cart-product-cancellationOutsideEu-price"]',
  ),
  cartCancellationWithinEuProductPrice: Selector(
    '[data-testid="cart-product-cancellationInsideEu-price"]',
  ),
  cartCardFeeText: Selector('[data-testid="cart-payment-price"]'),
  cartCheckInProduct: Selector('[data-testid="cart-product-onlineCheckIn"]'),
  cartCheckInBaggageProduct: Selector('[data-testid="cart-product-checkInBaggage"]'),
  cartCheckInBaggageProductMobile: Selector('[data-testid="cart-product-checkInBaggage-drawer"]'),
  cartContentContent: Selector('[data-testid="cart-content-Content"]'),
  cartDiscountCode: Selector('[data-testid="cart-payment-discount-price"]'),
  cartDiscountOrFeePrice: Selector('[data-testid="cart-payment-price"]'),
  cartComprehensiveInsuranceCoverGeniusProduct: Selector(
    '[data-testid="cart-product-comprehensiveInsuranceCoverGenius"]',
  ),
  cartComprehensiveInsuranceCoverGeniusProductMobile: Selector(
    '[data-testid="cart-product-comprehensiveInsuranceCoverGenius-drawer"]',
  ),
  cartExtraProductsContent: Selector('[data-testid="cart-content-products"]'),
  cartExtraProductsContentMobile: Selector('[data-testid="cart-content-products-drawer"]'),
  cartFlexTicketProduct: Selector('[data-testid="cart-product-flexibleTicket"]'),
  cartFlexTicketProductMobile: Selector('[data-testid="cart-product-flexibleTicket-drawer"]'),
  cartFlightContent: Selector('[data-testid="cart-content-Content"] div.etiCartItem'),
  cartFlightContentMobile: Selector('[data-testid="cart-content-Trip-drawer"] div'),
  cartMobileTravelPlanProduct: Selector('[data-testid="cart-product-mobileTravelPlan"]'),
  cartOnlineCheckinProduct: Selector('[data-testid="cart-product-onlineCheckIn"]'),
  cartPrice: Selector('[data-testid="cart-totalPrice-span"]'),
  cartPriceMobile: Selector('[data-testid="cart-totalPrice-span-drawer"]'),
  cartSeatMapProduct: Selector('[data-testid="cart-product-seatMap"]'),
  cartSeatMapProductMobile: Selector('[data-testid="cart-product-seatMap-drawer"]'),
  cartSmsProduct: Selector('[data-testid="cart-product-sms"]'),
  cartSupportPackageProduct: Selector('[data-testid="cart-product-servicePackage"]'),
  cartTagIcon: Selector('[data-testId="cart-tag-icon"]'),
  cartToggleButtonMobile: Selector('[data-testid="cart-cartButton-button"]'),
  cartTravelerinfo: Selector('[data-testid="cart-travelerInfo-CartTravelers"]'),
  cartTravelerInfoButton: Selector('[data-testid="cart-travelerInfoToggleButton-button"]'),
  cartTravelerInfoMobile: Selector('[data-testid="cart-travelerInfo-CartTravelers-drawer"]'),
  cartTripCancellationProduct: Selector('[data-testid="cart-product-tripCancellationProtection"]'),
  cartTripCancellationPrice: Selector(
    '[data-testid="cart-product-tripCancellationProtection-price"]',
  ),
  cartTrip: Selector('[data-testid="cart-content-Trip"] div'),
  cartTrips: Selector('[data-testid="cart-content-Trips"]'),
  cartTripMobile: Selector('[data-testid="cart-content-Trip-drawer"] div'),
  cartTripsMobile: Selector('[data-testid="cart-content-Trips-drawer"]'),
  checkInBaggageIcon: Selector('[data-testid="checkInBaggage-ProductIcon"]'),
  checkinBaggagePrice: Selector('[data-testid="cart-product-checkInBaggage-price"]'),
  checkinBaggagePriceMobile: Selector('[data-testid="cart-product-checkInBaggage-price-drawer"]'),
  checkoutContinueButton: Selector('#txtButton'),
  checkoutIFrame: Selector('[name="cko-3ds2-iframe"]'),
  checkoutPassword: Selector('#password'),
  checkPaymentConditions: Selector('[data-testid="payment-conditions-input"]'),
  discountCodeButton: Selector('[data-testid="discount-code-button"]'),
  discountCodeError: Selector('[data-testid="discount-code-error"]'),
  discountCodeInput: Selector('[data-testid="discount-code-input"]'),
  discountCodeRemoveButton: Selector('[data-testid="discount-code-remove-button"]'),
  discountCodeText: Selector('[data-testid="payment-bottomContent-priceSummary-discount"]'),
  discountCodeToggleInput: Selector('[data-testid="discount-form-toggle"]'),
  firstBoundPlaneIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(1) [data-testid="tripDetails-bound-plane-icon"]',
  ),
  freeCancellation: Selector('[data-testid="freeCancellationInformation-search-result"]'),
  freeCancellationDaysAheadText: Selector(
    '[data-testid="freeCancellationInformationDaysAhead-search-result"]',
  ),
  ibeDummyBankRadioButton: Selector('fieldset .etiCustomRadio'),
  klarnaLogo: Selector('[data-testid="paymentMethodLogo-klarna"]'),
  klarnaSliceFee: Selector('[data-testid="payment-paymentMethodFee-label-KlarnaSliceIt"]'),
  klarnaSliceLabel: Selector('[for="KlarnaSliceIt"]'),
  klarnaSliceRadiobutton: Selector('[for="KlarnaSliceIt"] [data-testid="payment-method-input"]'),
  klarnaPayLaterFee: Selector('[data-testid="payment-paymentMethodFee-label-KlarnaPayLater"]'),
  klarnaPayLaterLabel: Selector('[for="KlarnaPayLater"]'),
  klarnaPayLaterRadiobutton: Selector(
    '[for="KlarnaPayLater"] [data-testid="payment-method-input"]',
  ),
  owcInformation: Selector('[data-testid="tripDetails-oneWayCombination-wrapper"]'),
  payButton: Selector('[data-testid="payment-pay-button"]'),
  payCityInput: Selector('[data-testid="city-input"]'),
  payFirstNameInput: Selector('[data-testid="firstName-input"]'),
  payLastNameInput: Selector('[data-testid="lastName-input"]'),
  paymentContainer: Selector('[data-testid="paymentPage-paymentMethodsAndCart-container"]'),
  payPalLabel: Selector('[data-testid="paymentMethods-PayPal-label"]'),
  payPalEmailLogin: Selector('[name="login_email"]'),
  payPalNextButton: Selector('[name="btnNext"]'),
  payPalPassword: Selector('[name="login_password"]'),
  payPalLoginButton: Selector('[name="btnLogin"]'),
  payPalPayButton: Selector('[data-testid="submit-button-initial"]'),
  payPalFirstName: Selector('[data-testid="paypal-payment-form"] [data-testid="firstName-input"]'),
  payPalLastName: Selector('[data-testid="paypal-payment-form"] [data-testid="lastName-input"]'),
  payPalStreet: Selector('[data-testid="paypal-payment-form"] [data-testid="street-input"]'),
  payPalZipcode: Selector('[data-testid="paypal-payment-form"] [data-testid="zipCode-input"]'),
  payPalCity: Selector('[data-testid="paypal-payment-form"] [data-testid="city-input"]'),
  payPalPaymentOptions: Selector('[data-testid="stacked-payment-options"]'),
  payStreetInput: Selector('[data-testid="street-input"]'),
  payZipCodeInput: Selector('[data-testid="zipCode-input"]'),
  priceBoxAmountToPay: Selector(
    '[data-testid="payment-bottomContent-priceSummary-discount"] + div',
  ),
  priceBoxDiscountCodeSum: Selector('[data-testid="payment-bottomContent-priceSummary-discount"]'),
  priceChangeModal: Selector('.ReactModal__Content.ReactModal__Content--after-open.etiModal'),
  priceChangeYesButton: Selector(
    '.ReactModal__Content.ReactModal__Content--after-open button:nth-child(1)',
  ),
  priceChangeModalCloseButton: Selector('.etiModal__footer button'),
  secondBoundTrainIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-bound-train-icon"]',
  ),
  selfTransferHeader: Selector('[data-testid="self-transfer-header"]'),
  selfTransferInformationText: Selector('[data-testid="paymentPage-self-transfer-guarantee"]'),
  selfTransferText: Selector('[data-testid="self-transfer-content"]'),
  seatMapIcon: Selector('[data-testid="seatMap-ProductIcon"]'),
  shortConnectionNotification: Selector('[data-testid="short-connection-time-notification"]'),
  smallIcons: Selector('[data-testid="expansion-panel-flight"] svg'),
  stepIndicatorCurrent: Selector('[data-testid="current-step"]'),
  stepIndicatorNotVisited: Selector('[data-testid="not-visited-step"]'),
  stepIndicatorVisited: Selector('[data-testid="visited-step"]'),
  supportPremiumIcon: Selector('[data-testid="servicePackage-ProductIcon"]'),
  toggleCartButton: Selector('[data-testid="cart-toggleButton-button"]'),
  trainSegmentIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-segment-train"] svg',
  ),
  travelerContainer: Selector('[data-testid="paymentPage-travelerList-container"]'),
  travelerDetailsAge: Selector('[data-testid="traveler-ageType"]'),
  travelerDetailsEmail: Selector('[data-testid="traveler-email"]'),
  travelerDetailsName: Selector('[data-testid="traveler-name"]'),
  travelerDetailsPhone: Selector('[data-testid="traveler-phone"]'),
  tripDetailsToggleButton: Selector('[data-testid="expansion-panel-flight"]'),
  travelerDetailsToggleButton: Selector('[data-testid="expansion-panel-travelers"]'),
  tripBound: Selector('[data-testid="tripDetails-bound"]'),
  tripHeaderFlight: Selector('[data-testid="tripDetails-title-TitleText"]'),
  tripHeaderTravelers: Selector('[data-testid="tripDetails-title-travelers-desktop"]'),
  tripInfoText: Selector('[data-testid="tripDetails-segment-event"]'),
  tripSegment: Selector('[data-testid="tripDetails-segment"]'),
  tripSegFirstDestination: Selector('[data-testid="trip-segment-destination-time"]')
    .nth(0)
    .nextSibling(),
  tripSegFirstOrigin: Selector('[data-testid="trip-segment-origin-time"]')
    .nth(0)
    .nextSibling(),
  tripSegmentFlightNr: Selector('[data-testid="tripDetails-segment-TripDetailsSegmentInfo"]'),
  tripSegSecondDestination: Selector('[data-testid="trip-segment-destination-time"]')
    .nth(1)
    .nextSibling(),
  tripSegSecondOrigin: Selector('[data-testid="trip-segment-origin-time"]')
    .nth(1)
    .nextSibling(),
  trustlyLogo: Selector('[data-testid="paymentMethodLogo-trustly"]'),
  voucherNotValidInfo: Selector('[data-testid="payment-page-voucherNotValid"]'),
  zeroCartNotification: Selector('[data-testid="payment-notification-zeroAmountCart"]'),
};
