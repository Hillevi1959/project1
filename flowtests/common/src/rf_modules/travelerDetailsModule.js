import { Selector } from 'testcafe';

export default {
  airHelpPlusNoButton: Selector('[data-testid="airHelp--false"]'),
  airHelpPlusYesButton: Selector('[data-testid="airHelp--true"]'),
  airHelpContainer: Selector('[data-testid="airHelp-container"]'),
  allProductsInCartMobile: Selector('[data-testid="cart-content-products-drawer"] li'),
  allProductsInCart: Selector('[data-testid="cart-content-products-widget"] li'),
  baggageInsuranceGadgetGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-baggageInsuranceGadgetCoverGenius-InsuranceProduct"]',
  ),
  baggageInsuranceGadgetGeniusButtonYes: Selector(
    '[data-testid="baggageInsuranceGadgetCoverGenius--true"]',
  ),
  baggageInsuranceGadgetGeniusButtonNo: Selector(
    '[data-testid="baggageInsuranceGadgetCoverGenius--false"]',
  ),
  travelInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-travelInsuranceCoverGenius-InsuranceProduct"]',
  ),
  travelInsuranceGeniusButtonYes: Selector('[data-testid="travelInsuranceCoverGenius--true"]'),
  travelInsuranceGeniusButtonNo: Selector('[data-testid="travelInsuranceCoverGenius--false"]'),
  cancellationInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-cancellationInsuranceCoverGenius-InsuranceProduct"]',
  ),
  cancellationInsuranceGeniusButtonYes: Selector(
    '[data-testid="cancellationInsuranceCoverGenius--true"]',
  ),
  cancellationInsuranceGeniusButtonNo: Selector(
    '[data-testid="cancellationInsuranceCoverGenius--false"]',
  ),
  baggageInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-baggageInsuranceCoverGenius-InsuranceProduct"]',
  ),
  baggageInsuranceGeniusButtonYes: Selector('[data-testid="baggageInsuranceCoverGenius--true"]'),
  baggageInsuranceGeniusButtonNo: Selector('[data-testid="baggageInsuranceCoverGenius--false"]'),
  bankruptcyInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-bankruptcyInsuranceCoverGenius-InsuranceProduct"]',
  ),
  bankruptcyInsuranceGeniusButtonYes: Selector(
    '[data-testid="bankruptcyInsuranceCoverGenius--true"]',
  ),
  bankruptcyInsuranceGeniusButtonNo: Selector(
    '[data-testid="bankruptcyInsuranceCoverGenius--false"]',
  ),
  baggageInsuranceComboGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-baggageInsuranceComboCoverGenius-InsuranceProduct"]',
  ),
  baggageInsuranceComboGeniusYes: Selector(
    '[data-testid="baggageInsuranceComboCoverGenius--true"]',
  ),
  baggageInsuranceComboGeniusNo: Selector(
    '[data-testid="baggageInsuranceComboCoverGenius--false"]',
  ),
  baggageServiceContainer: Selector('[data-testid="baggageService-container"]'),
  baggageServiceYesButton: Selector('[data-testid="baggageService--true"]'),
  baggageServiceNoButton: Selector('[data-testid="baggageService--false"]'),
  bookButton: Selector('[data-testid="bookNow-button"]'),
  cabinClassInfo: Selector('[data-testid="tripDetails-segment-cabinClass"]'),
  cabinBaggageContainer: Selector('[data-testid="cabinBaggage-container"]'),
  cabinBaggageYesButton: Selector('[data-testid="cabinBaggage--true"]'),
  cabinBaggageNoButton: Selector('[data-testid="cabinBaggage--false"]'),
  cancellationNoInsideEu: Selector('[data-testid="cancellationInsideEu--false"]'),
  cancellationYesInsideEu: Selector('[data-testid="cancellationInsideEu--true"]'),
  cancellationInsideEuContainer: Selector('[data-testid="cancellationInsideEu-container"]'),
  cancellationOutsideEuContainer: Selector('[data-testid="cancellationOutsideEu-container"]'),
  cancellationNoOutsideEu: Selector('[data-testid="cancellationOutsideEu--false"]'),
  cancellationYesOutsideEu: Selector('[data-testid="cancellationOutsideEu--true"]'),
  cartBannerMobile: Selector('[data-testid="notification-bar-wrapper"]'),
  cartCancellationInsideEuContainer: Selector('[data-testid="cancellationInsideEu-container"]'),
  cartCancellationInsideEuProduct: Selector(
    '[data-testid="cart-product-cancellationInsideEu-widget"]',
  ),
  cartCancellationInsideEuProductMobile: Selector(
    '[data-testid="cart-product-cancellationInsideEu-price-drawer"]',
  ),
  cartCheckInBaggageProductMobile: Selector('[data-testid="cart-product-checkInBaggage-drawer"]'),
  cartDiscountInformation: Selector('[data-testid="cart-payment-price"]'),
  cartSeatMapProductMobile: Selector('[data-testid="cart-product-seatMap-drawer"]'),
  cartBaggagePriceMobile: Selector('[data-testid="cart-product-checkInBaggage-price-drawer"]'),
  cartCloseButtonMobile: Selector('[data-testid="cart-closeButton-button-drawer"]'),
  cartToggleButtonMobile: Selector('[data-testid="cart-cartButton-button"]'),
  cartFlexTicketProduct: Selector('[data-testid="cart-product-flexibleTicket-widget"]'),
  cartFlexTicketProductMobile: Selector('[data-testid="cart-product-flexibleTicket-drawer"]'),
  cartFlight: Selector('[data-testid="cart-content-Trip-widget"] div'),
  cartFlightMobile: Selector('[data-testid="cart-content-Trip-drawer"] div'),
  cartPassengers: Selector('[data-testid="traveler-price-info-widget"]'),
  cartPassengersMobile: Selector('[data-testid="traveler-price-info-drawer"]'),
  cartCancellationWithinEuProduct: Selector(
    '[data-testid="cart-product-cancellationInsideEu-widget"]',
  ),
  cancellationWithinEuProductPrice: Selector('[data-testid="cancellationInsideEu-price"]'),
  cancellationOutsideEuProductPrice: Selector('[data-testid="cancellationOutsideEu-price"]'),
  cartCancellationWithinEuProductPrice: Selector(
    '[data-testid="cart-product-cancellationInsideEu-price-widget"]',
  ),
  cartCancellationOutsideEuProductPrice: Selector(
    '[data-testid="cart-product-cancellationOutsideEu-price-widget"]',
  ),
  cartCheckInBaggageProduct: Selector('[data-testid="cart-product-checkInBaggage-widget"]'),
  cartSeatMapProduct: Selector('[data-testid="cart-product-seatMap-widget"]'),
  cartSupportPackageProduct: Selector('[data-testid="cart-product-servicePackage-widget"]'),
  cartCheckInProduct: Selector('[data-testid="cart-product-onlineCheckIn-widget"]'),
  cartMobileTravelPlanProduct: Selector('[data-testid="cart-product-mobileTravelPlan-widget"]'),
  cartSmsProduct: Selector('[data-testid="cart-product-sms-widget"]'),
  cartExtraProductsContentMobile: Selector('[data-testid="cart-content-products-drawer"]'),
  cartExtraProductsContent: Selector('[data-testid="cart-content-products-widget"]'),
  cartFlightContent: Selector('[data-testid="cart-content-Content"] div.etiCartItem'),
  cartTagIcon: Selector('[data-testId="cart-tag-icon"]'),
  cartTravelerInfo: Selector('[data-testid="traveler-price-info"]'),
  cartTravelerToggleButton: Selector('[data-testid="cart-travelerInfoToggleButton-button"]'),
  cartTravelerToggleButtonMobile: Selector('[data-testid="cart-travelerInfoToggleButton-button"]'),
  cartTrips: Selector('[data-testid="cart-content-Trips-widget"]'),
  cartTripsMobile: Selector('[data-testid="cart-content-Trips-drawer"]'),
  cartTrip: Selector('[data-testid="cart-content-Trip-widget"]'),
  cartTripMobile: Selector('[data-testid="cart-content-Trip-drawer"] div'),
  cartPrice: Selector('[data-testid="cart-content-Content"] div div'),
  cartTripPrice: Selector('[data-testid="cart-totalPrice-span-widget"]'),
  cartTripPriceMobile: Selector('[data-testid="cart-totalPrice-span-drawer"]'),
  cartBaggagePrice: Selector('[data-testid="cart-product-checkInBaggage-price-widget"]'),
  cartTripCancellationPrice: Selector(
    '[data-testid="cart-product-tripCancellationProtection-price-widget"]',
  ),
  cartAllInclusivePrice: Selector(
    '[data-testid="cart-product-allInclusiveProtection-price-widget"]',
  ),
  checkInBaggageButtons: Selector('[data-testid="travelers"] .etiToggleBar'),
  checkInBaggageModalNoButton: Selector('[data-testid="checkInBaggageModal-decline-button"]'),
  checkInBaggageNoOnePassenger: Selector('[data-testid="checkInBaggage-traveler-0-false"]'),
  checkInBaggageNoAllPassengers: Selector('[data-testid="checkInBaggage-toggleTravelers-false"]'),
  checkinBaggageYesAllPassengers: Selector('[data-testid="checkInBaggage-toggleTravelers-true"]'),
  checkInBaggageYesOnePassenger: Selector('[data-testid="checkInBaggage-travelerModule-0-true"]'),
  checkInBaggageCheckbox: Selector('[data-testid="travelers"] [type="checkbox"]'),
  checkInBaggagePrice: Selector('[data-testid="checkInBaggage-price"]'),
  checkInBaggageIcon: Selector('[data-testid="checkInBaggage-ProductIcon"]'),
  checkInBaggageContainer: Selector('[data-testid="checkInBaggage-container"]'),
  climateCompensatedIcon: Selector('[data-testid="climateCompensation-ProductIcon"]'),
  contactForm: Selector('[data-testid="travelerDetails-contactForm"]'),
  contactPersonMail: Selector('[for="traveler-mail"]'),
  contactPersonPhone: Selector('[for="traveler-phone"]'),
  extraProductsContainer: Selector('[data-testid="travelerDetails-products"]'),
  flexibleTicketDropDown: Selector('.flexibleTicket .etiCheckboxDropdown'),
  flexibleTicketIcon: Selector('[data-testid="flexibleTicket-ProductIcon"]'),
  flexibleTicketContainer: Selector('[data-testid="flexibleTicket-container"]'),
  flexibleTicketModalNoButton: Selector('[data-testid="flexibleTicketModal-decline-button"]'),
  manulifeAllinclisiveContainer: Selector('[data-testid="allInclusiveProtection-container"]'),
  manulifeAllinclusiveNoButton: Selector('[data-testid="allInclusiveProtection--false"]'),
  manulifeAllinclusiveYesButton: Selector('[data-testid="allInclusiveProtection--true"]'),
  manulifeAllinclusiveProvinceInput: Selector('[data-testid="allInclusiveProtection-province"]'),
  manulifeAllinclusiveTotalPrice: Selector('[data-testid="allInclusiveProtection-price"]'),
  manulifeCancellationContainer: Selector('[data-testid="tripCancellationProtection-container"]'),
  manulifeCancellationNoButton: Selector('[data-testid="tripCancellationProtection--false"]'),
  manulifeCancellationYesButton: Selector('[data-testid="tripCancellationProtection--true"]'),
  manulifeCancellationProvinceInput: Selector(
    '[data-testid="tripCancellationProtection-province"]',
  ),
  manulifeCancellationTotalPrice: Selector('[data-testid="tripCancellationProtection-price"]'),
  manulifeCancellationTravelerContainer: travelerNr =>
    Selector(`[data-testid="tripCancellationProtection-traveler-${travelerNr}"]`),
  manulifeAllInclusiveTravelerContainer: travelerNr =>
    Selector(`[data-testid="allInclusiveProtection-traveler-${travelerNr}"]`),
  mealContainer: Selector('[data-testid="meal-container"]'),
  mealDropDownOneTraveler: Selector(
    '[data-testid="meal-container"] [class*="container etiDropdown"]',
  ),
  mealDropDownMultipleTravelers: Selector('[data-testid="meal-container"] .etiButton'),
  mealDropDownTraveler: Selector('.meal__traveler [class*="container etiDropdown"]'),
  mobileTravelPlanContainer: Selector('[data-testid="mobileTravelPlan-container"]'),
  mobileTravelPlanNoButton: Selector('[data-testid="mobileTravelPlan--false"]'),
  mobileTravelPlanYesButton: Selector('[data-testid="mobileTravelPlan--true"]'),
  onlineCheckinBaggageContainer: Selector('[data-testid="onlineCheckIn-container"]'),
  onlineCheckinNoButton: Selector('[data-testid="onlineCheckIn--false"]'),
  onlineCheckinYesButton: Selector('[data-testid="onlineCheckIn--true"]'),
  openFlightButton: Selector('[data-testid="searchResults-arrowDown-button"]'),
  owcInformation: Selector('[data-testid="tripDetails-oneWayCombination-wrapper"]'),
  proceedToReviewButton: Selector('[data-testid="proceed-button"]'),
  seatMapCancelButton: Selector('[data-testid="cancelSeatMap-button"]'),
  seatMapIcon: Selector('[data-testid="seatMap-ProductIcon"]'),
  seatMapContainer: Selector('[data-testid="seatMap-container"]'),
  seatMapNoButton: Selector('[data-testid="seatMap--false"]'),
  seatMapYesButton: Selector('[data-testid="seatMap--true"]'),
  selfTransferHeaderClosedTrip: Selector(
    '.resultPage-flightResults-0 [data-testid="self-transfer-header"]',
  ),
  selfTransferHeader: Selector('[data-testid="self-transfer-header"]'),
  selfTransferText: Selector('[data-testid="self-transfer-content"]'),
  selfTransferInformationText: Selector(
    '[data-testid="travelerDetailsPage-self-transfer-guarantee"]',
  ),
  shortConnectionNotification: Selector('[data-testid="short-connection-time-notification"]'),
  simpleVisaContainer: Selector('[data-testid="simpleVisa-container"]'),
  simpleVisaYesButton: Selector('[data-testid="simpleVisa--true"]'),
  simpleVisaNoButton: Selector('[data-testid="simpleVisa--false"]'),
  smallIcons: Selector('[data-testid="expansion-panel-flight"] svg'),
  smsContainer: Selector('[data-testid="sms-container"]'),
  smsNoButton: Selector('[data-testid="sms--false"]'),
  smsYesButton: Selector('[data-testid="sms--true"]'),
  stepIndicatorVisited: Selector('[data-testid="visited"]'),
  stepIndicator: Selector('[data-testid="step"]'),
  supportPackageBasic: Selector('[for="choice.supportPackage.0"] .etiCustomRadio'),
  newSupportPackageBasic: Selector('[for="toggleChoice.supportPackage.0"]'),
  supportPackageBasicMobile: Selector('[data-testid="supportPackage-select-basic"]'),
  supportPackageBasicStringSelector: '[for="choice.supportPackage.0"] .etiCustomRadio',
  supportPackageBasicStringMobile: '[for="toggleChoice.supportPackage.0"] .etiCustomRadio',
  supportPackageModalNoButton: Selector('[data-testid="servicePackageModal-decline-button"]'),
  supportPackagePremiumIcon: Selector('[data-testid="servicePackage-ProductIcon"]'),
  supportPackagePremium: Selector('[for="choice.supportPackage.62"]'),
  newSupportPackagePremium: Selector('[for="toggleChoice.supportPackage.62"]'),
  supportPackagePremiumMobile: Selector('[for="toggleChoice.supportPackage.62"]'),
  supportPackageComponent: Selector('[data-testid="servicePackage-component"]'),
  supportPackageMobileTravelPlan: Selector(
    '[data-testid="servicePackage-mobileTravelPlan-trigger"]',
  ),
  supportPackageOnlineCheckIn: Selector('[data-testid="servicePackage-onlineCheckIn-trigger"]'),
  firstBoundPlaneIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(1) [data-testid="tripDetails-bound-plane-icon"]',
  ),
  secondBoundTrainIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-bound-train-icon"]',
  ),
  trainSegmentIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-segment-train"] svg',
  ),
  travelerContainer: Selector('[data-testid="travelerDetails-passenger-info"]'),
  travelerDetailsPage: Selector('[data-testid="travelerDetailsPage"]'),
  travelerDetailsForm: Selector('[data-testid="travelerDetailsForm"]'),
  travelInsuranceInEuYes: Selector('[data-testid="travelInsuranceInsideEu--true"]'),
  travelInsuranceInEuNo: Selector('[data-testid="travelInsuranceInsideEu--false"]'),
  travelInsuranceInsideEuModalYes: Selector(
    '[data-testid="travelInsuranceInsideEuModal-confirm-button"]',
  ),
  travelInsuranceInsideEuContainer: Selector('[data-testid="travelInsuranceInsideEu-container"]'),
  travelInsuranceOutsideEuYes: Selector('[data-testid="travelInsuranceOutsideEu--true"]'),
  travelInsuranceOutsideEuNo: Selector('[data-testid="travelInsuranceOutsideEu--false"]'),
  travelInsuranceOusideEuModalYes: Selector(
    '[data-testid="travelInsuranceOutsideEuModal-confirm-button"]',
  ),
  travelInsuranceOutsideEuContainer: Selector('[data-testid="travelInsuranceOutsideEu-container"]'),
  tripBound: Selector('[data-testid="tripDetails-bound"]'),
  tripDetailsArrow: Selector('[data-testid="expansion-panel-flight"]'),
  tripInfoText: Selector('[data-testid="tripDetails-segment-event"]'),
  tripSegment: Selector('[data-testid="tripDetails-segment"]'),
  tripSegmentFlightNr: Selector('[data-testid="tripDetails-segment-TripDetailsSegmentInfo"]'),
  tripSegFirstOrigin: Selector('[data-testid="trip-segment-origin-time"]')
    .nth(0)
    .nextSibling(),
  tripSegSecondOrigin: Selector('[data-testid="trip-segment-origin-time"]')
    .nth(1)
    .nextSibling(),
  tripSegFirstDestination: Selector('[data-testid="trip-segment-destination-time"]')
    .nth(0)
    .nextSibling(),
  tripSegSecondDestination: Selector('[data-testid="trip-segment-destination-time"]')
    .nth(1)
    .nextSibling(),
  voucherNotValidInfo: Selector('[data-testid="travelerDetailsForm-voucherNotValid"]'),

  addBaggageForTraveler: (travelerNr, addBaggage) =>
    Selector(`[data-testid="checkInBaggage-traveler-${travelerNr}-${addBaggage}"]`),
  expiryDateError: travelerNr =>
    Selector(
      `[data-testid="travelerDetails-traveler-${travelerNr}-section"] [data-testid="components-textInput"].error`,
    ),
  expiryDateInput: travelerNr =>
    Selector(`[data-testid="traveler-travel-document-expiry-date-${travelerNr}-input"]`),
  expiryDateMessage: travelerNr =>
    Selector(
      `[data-testid="travelerDetails-traveler-${travelerNr}-section"] [data-testid="components-textInput"]:nth-child(3)`,
    ),
  passportInformation: travelerNr =>
    Selector(
      `[data-testid="travelerDetails-traveler-${travelerNr}-section"] [data-testid="travelerDetails-travelDocument-wrapper"]`,
    ),
  passPortNumberInput: travelerNr =>
    Selector(`[data-testid="traveler-travel-document-number-${travelerNr}-input"]`),
  setDateOfBirth: passengerNr =>
    Selector(`[data-testid="traveler-date-of-birth-form-${passengerNr}-input"]`),
  setDateOfBirthManulifeCancellation: passengerNr =>
    Selector(
      `[data-testid="tripCancellationProtection-traveler-${passengerNr}"] [data-testid="traveler-${passengerNr}.dateOfBirth-input"]`,
    ),
  setDateOfBirthManulifeAllInclusive: passengerNr =>
    Selector(
      `[data-testid="allInclusiveProtection-traveler-${passengerNr}"] [data-testid="traveler-${passengerNr}.dateOfBirth-input"]`,
    ),
  setFirstName: passengerNr => Selector(`[data-testid="traveler-firstName-${passengerNr}-input"]`),
  setGender: (gender, passengerNr) =>
    Selector(`[data-testid="travelerDetails-${gender}-${passengerNr}-label"]`),
  setLastName: passengerNr => Selector(`[data-testid="traveler-lastName-${passengerNr}-input"]`),
  travelerInput: travelerNr =>
    Selector(`[data-testid="travelerDetails-traveler-${travelerNr}-section"] input`),
};
