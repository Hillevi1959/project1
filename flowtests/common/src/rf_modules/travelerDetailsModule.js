import { Selector } from 'testcafe';

export default {
  addBaggageForTraveler: (travelerNr, addBaggage) =>
    Selector(`[data-testid="checkInBaggage-traveler-${travelerNr}-${addBaggage}"]`),
  airHelpContainer: Selector('[data-testid="airHelp-container"]'),
  airHelpPlusNoButton: Selector('[data-testid="airHelp--false"]'),
  airHelpPlusYesButton: Selector('[data-testid="airHelp--true"]'),
  allProductsInCart: Selector('[data-testid="cart-content-products-widget"] li'),
  allProductsInCartMobile: Selector('[data-testid="cart-content-products-drawer"] li'),
  baggageInsuranceGadgetGeniusButtonYes: Selector(
    '[data-testid="baggageInsuranceGadgetCoverGenius--true"]',
  ),
  baggageInsuranceGadgetGeniusButtonNo: Selector(
    '[data-testid="baggageInsuranceGadgetCoverGenius--false"]',
  ),
  baggageInsuranceGadgetGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-baggageInsuranceGadgetCoverGenius-InsuranceProduct"]',
  ),
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
  cabinBaggageContainer: Selector('[data-testid="cabinBaggage-container"]'),
  cabinBaggageNoButton: Selector('[data-testid="cabinBaggage--false"]'),
  cabinBaggageYesButton: Selector('[data-testid="cabinBaggage--true"]'),
  cabinClassInfo: Selector('[data-testid="tripDetails-segment-cabinClass"]'),
  cancellationInsideEuContainer: Selector('[data-testid="cancellationInsideEu-container"]'),
  cancellationNoInsideEu: Selector('[data-testid="cancellationInsideEu--false"]'),
  cancellationNoOutsideEu: Selector('[data-testid="cancellationOutsideEu--false"]'),
  cancellationOutsideEuContainer: Selector('[data-testid="cancellationOutsideEu-container"]'),
  cancellationOutsideEuProductPrice: Selector('[data-testid="cancellationOutsideEu-price"]'),
  cancellationWithinEuProductPrice: Selector('[data-testid="cancellationInsideEu-price"]'),
  cancellationYesInsideEu: Selector('[data-testid="cancellationInsideEu--true"]'),
  cancellationYesOutsideEu: Selector('[data-testid="cancellationOutsideEu--true"]'),
  cartAllInclusivePrice: Selector(
    '[data-testid="cart-product-allInclusiveProtection-price-widget"]',
  ),
  cartAllInclusivePriceMobile: Selector(
    '[data-testid="cart-product-allInclusiveProtection-price-drawer"]',
  ),
  cartAncillaryBundle: Selector('[data-testid="cart-bundle-1-widget"]'),
  cartAncillaryBundleMobile: Selector('[data-testid="cart-bundle-1-drawer"]'),
  cartBaggagePrice: Selector('[data-testid="cart-product-checkInBaggage-price-widget"]'),
  cartBaggagePriceMobile: Selector('[data-testid="cart-product-checkInBaggage-price-drawer"]'),
  cartBannerMobile: Selector('[data-testid="notification-bar-wrapper"]'),
  cartCancellationInsideEuContainer: Selector('[data-testid="cancellationInsideEu-container"]'),
  cartCancellationInsideEuProduct: Selector(
    '[data-testid="cart-product-cancellationInsideEu-widget"]',
  ),
  cartCancellationInsideEuProductMobile: Selector(
    '[data-testid="cart-product-cancellationInsideEu-price-drawer"]',
  ),
  cartCancellationOutsideEuProductPrice: Selector(
    '[data-testid="cart-product-cancellationOutsideEu-price-widget"]',
  ),
  cartCancellationOutsideEuProductPriceMobile: Selector(
    '[data-testid="cart-product-cancellationOutsideEu-price-drawer"]',
  ),
  cartCancellationOutsideEuProductMobile: Selector(
    '[data-testid="cart-product-cancellationOutsideEu-drawer"]',
  ),
  cartCancellationWithinEuProduct: Selector(
    '[data-testid="cart-product-cancellationInsideEu-widget"]',
  ),
  cartCancellationWithinEuProductPrice: Selector(
    '[data-testid="cart-product-cancellationInsideEu-price-widget"]',
  ),
  cartCancellationWithinEuProductPriceMobile: Selector(
    '[data-testid="cart-product-cancellationInsideEu-price-drawer"]',
  ),
  cartCheckInProduct: Selector('[data-testid="cart-product-onlineCheckIn-widget"]'),
  cartCheckInProductMobile: Selector('[data-testid="cart-product-onlineCheckIn-price-drawer"]'),
  cartCheckInBaggageProduct: Selector('[data-testid="cart-product-checkInBaggage-widget"]'),
  cartExtraProductsContent: Selector('[data-testid="cart-content-products-widget"]'),
  cartCheckInBaggageProductMobile: Selector('[data-testid="cart-product-checkInBaggage-drawer"]'),
  cartCloseButtonMobile: Selector('[data-testid="cart-closeButton-button-drawer"]'),
  cartComprehensiveInsuranceCoverGeniusProduct: Selector(
    '[data-testid="cart-product-comprehensiveInsuranceCoverGenius-widget"]',
  ),
  cartComprehensiveInsuranceCoverGeniusProductMobile: Selector(
    '[data-testid="cart-product-comprehensiveInsuranceCoverGenius-drawer"]',
  ),
  cartDiscountInformation: Selector('[data-testid="cart-payment-price"]'),
  cartExtraProductsContentMobile: Selector('[data-testid="cart-content-products-drawer"]'),
  cartFlexTicketProduct: Selector('[data-testid="cart-product-flexibleTicket-widget"]'),
  cartFlexTicketProductMobile: Selector('[data-testid="cart-product-flexibleTicket-drawer"]'),
  cartFlight: Selector('[data-testid="cart-content-Trip-widget"] div'),
  cartFlightContent: Selector('[data-testid="cart-content-Content"] div.etiCartItem'),
  cartFlightMobile: Selector('[data-testid="cart-content-Trip-drawer"] div'),
  cartMarkupPrice: Selector('[data-testid="cart-travelers-ADT-markup-widget"]'),
  cartMarkupPriceMobile: Selector('[data-testid="cart-travelers-ADT-markup-drawer"]'),
  cartMobileTravelPlanProduct: Selector('[data-testid="cart-product-mobileTravelPlan-widget"]'),
  cartMobileTravelPlanProductMobile: Selector(
    '[data-testid="cart-product-mobileTravelPlan-drawer"]',
  ),
  cartSeatMapProductMobile: Selector('[data-testid="cart-product-seatMap-drawer"]'),
  cartToggleButtonMobile: Selector('[data-testid="cart-cartButton-button"]'),
  cartPassengers: Selector('[data-testid="traveler-price-info-widget"]'),
  cartPassengersMobile: Selector('[data-testid="traveler-price-info-drawer"]'),
  cartPrice: Selector('[data-testid="cart-content-Content"] div div'),
  cartSeatMapProduct: Selector('[data-testid="cart-product-seatMap-widget"]'),
  cartSmsProduct: Selector('[data-testid="cart-product-sms-widget"]'),
  cartSmsProductMobile: Selector('[data-testid="cart-product-sms-drawer"]'),
  cartSupportPackageProduct: Selector('[data-testid="cart-product-servicePackage-widget"]'),
  cartSupportPackageProductMobile: Selector(
    '[data-testid="cart-product-servicePackage-price-drawer"]',
  ),
  cartTagIcon: Selector('[data-testId="cart-tag-icon"]'),
  cartTravelerInfo: Selector('[data-testid="traveler-price-info"]'),
  cartTravelerToggleButton: Selector('[data-testid="cart-travelerInfoToggleButton-button"]'),
  cartTravelerToggleButtonMobile: Selector('[data-testid="cart-travelerInfoToggleButton-button"]'),
  cartTrip: Selector('[data-testid="cart-content-Trip-widget"]'),
  cartTrips: Selector('[data-testid="cart-content-Trips-widget"]'),
  cartTripMobile: Selector('[data-testid="cart-content-Trip-drawer"] div'),
  cartTripsMobile: Selector('[data-testid="cart-content-Trips-drawer"]'),
  cartTripPrice: Selector('[data-testid="cart-totalPrice-span-widget"]'),
  cartTripPriceMobile: Selector('[data-testid="cart-totalPrice-span-drawer"]'),
  cartTripCancellationPrice: Selector(
    '[data-testid="cart-product-tripCancellationProtection-price-widget"]',
  ),
  cartTripCancellationPriceMobile: Selector(
    '[data-testid="cart-product-tripCancellationProtection-price-drawer"]',
  ),
  checkInBaggageButtons: Selector('[data-testid="travelers"] .etiToggleBar'),
  checkInBaggageCheckbox: Selector('[data-testid="travelers"] [type="checkbox"]'),
  checkInBaggageContainer: Selector('[data-testid="checkInBaggage-container"]'),
  checkInBaggageIcon: Selector('[data-testid="checkInBaggage-ProductIcon"]'),
  checkInBaggageModalNoButton: Selector('[data-testid="checkInBaggageModal-decline-button"]'),
  checkInBaggageNoAllPassengers: Selector('[data-testid="checkInBaggage-toggleTravelers-false"]'),
  checkInBaggageNoOnePassenger: Selector('[data-testid="checkInBaggage-traveler-0-false"]'),
  checkInBaggagePrice: Selector('[data-testid="checkInBaggage-price"]'),
  checkinBaggageYesAllPassengers: Selector('[data-testid="checkInBaggage-toggleTravelers-true"]'),
  checkInBaggageYesOnePassenger: Selector('[data-testid="checkInBaggage-traveler-0-true"]'),
  climateCompensatedIcon: Selector('[data-testid="climateCompensation-ProductIcon"]'),
  comprehensiveInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-comprehensiveInsuranceCoverGenius-InsuranceProduct"]',
  ),
  comprehensiveInsuranceGeniusButtonYes: Selector(
    '[data-testid="comprehensiveInsuranceCoverGenius--true"]',
  ),
  comprehensiveInsuranceGeniusButtonNo: Selector(
    '[data-testid="comprehensiveInsuranceCoverGenius--false"]',
  ),
  contactForm: Selector('[data-testid="travelerDetails-contactForm"]'),
  contactPersonMail: Selector('[for="traveler-mail"]'),
  contactPersonPhone: Selector('[for="traveler-phone"]'),
  documentTypeDropdown: travelerNr =>
    Selector(`[data-testid="document-types-dropdown-${travelerNr}"]`),
  editSearchButton: Selector('[data-testid="edit-search-button"]'),
  errorMessage: Selector('[data-testid="components-textInput"] > .message > [type="error"]'),
  expiryDateError: travelerNr =>
    Selector(
      `[data-testid="travelerDetails-traveler-${travelerNr}-section"] [data-testid="components-textInput"].error`,
    ),
  expiryDateInput: travelerNr =>
    Selector(`[data-testid="traveler-travel-document-expiry-date-${travelerNr}-input"]`),
  expiryDateMessage: travelerNr =>
    Selector(
      `[data-testid="travelerDetails-traveler-${travelerNr}-section"] [data-testid="components-textInput"] .message`,
    ),
  extraProductsContainer: Selector('[data-testid="travelerDetails-products"]'),
  firstBoundPlaneIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(1) [data-testid="tripDetails-bound-plane-icon"]',
  ),
  flexibleTicketContainer: Selector('[data-testid="flexibleTicket-container"]'),
  flexibleTicketDropDown: Selector('.flexibleTicket .etiCheckboxDropdown'),
  flexibleTicketIcon: Selector('[data-testid="flexibleTicket-ProductIcon"]'),
  flexibleTicketModalNoButton: Selector('[data-testid="flexibleTicketModal-decline-button"]'),
  freeCancellation: Selector('[data-testid="freeCancellationInformation-search-result"]'),
  freeCancellationDaysAheadText: Selector(
    '[data-testid="freeCancellationInformationDaysAhead-search-result"]',
  ),
  manulifeAllinclusiveContainer: Selector('[data-testid="allInclusiveProtection-container"]'),
  manulifeAllinclusiveNoButton: Selector('[data-testid="allInclusiveProtection--false"]'),
  manulifeAllinclusiveProvinceInput: Selector('[data-testid="allInclusiveProtection-province"]'),
  manulifeAllinclusiveTotalPrice: Selector('[data-testid="allInclusiveProtection-price"]'),
  manulifeAllInclusiveTravelerContainer: travelerNr =>
    Selector(`[data-testid="allInclusiveProtection-traveler-${travelerNr}"]`),
  manulifeAllinclusiveYesButton: Selector('[data-testid="allInclusiveProtection--true"]'),
  manulifeCancellationContainer: Selector('[data-testid="tripCancellationProtection-container"]'),
  manulifeCancellationNoButton: Selector('[data-testid="tripCancellationProtection--false"]'),
  manulifeCancellationProvinceInput: Selector(
    '[data-testid="tripCancellationProtection-province"]',
  ),
  manulifeCancellationTotalPrice: Selector('[data-testid="tripCancellationProtection-price"]'),
  manulifeCancellationTravelerContainer: travelerNr =>
    Selector(`[data-testid="tripCancellationProtection-traveler-${travelerNr}"]`),
  manulifeCancellationYesButton: Selector('[data-testid="tripCancellationProtection--true"]'),
  mealContainer: Selector('[data-testid="meal-container"]'),
  mealDropDownOneTraveler: Selector('[data-testid*="meal-dropdown"]'),
  mealDropDownMultipleTravelers: Selector('[data-testid="meal-toggle-button-wrapper"]'),
  mealDropDownTraveler: Selector('[data-testid*="meal-dropdown"] [class*="etiDropdown"]'),
  mobileTravelPlanContainer: Selector('[data-testid="mobileTravelPlan-container"]'),
  mobileTravelPlanNoButton: Selector('[data-testid="mobileTravelPlan--false"]'),
  mobileTravelPlanYesButton: Selector('[data-testid="mobileTravelPlan--true"]'),
  nationalityDropdown: travelerNr =>
    Selector(`[data-testid="travelerDetails-TravelDocumentIssueCountry-${travelerNr}-dropdown"]`),
  onlineCheckinBaggageContainer: Selector('[data-testid="onlineCheckIn-container"]'),
  onlineCheckinNoButton: Selector('[data-testid="onlineCheckIn--false"]'),
  onlineCheckinYesButton: Selector('[data-testid="onlineCheckIn--true"]'),
  openFlightButton: Selector('[data-testid="searchResults-arrowDown-button"]'),
  owcInformation: Selector('[data-testid="tripDetails-oneWayCombination-wrapper"]'),
  passportInformation: travelerNr =>
    Selector(
      `[data-testid="travelerDetails-traveler-${travelerNr}-section"] [data-testid="travelerDetails-travelDocument-wrapper"]`,
    ),
  passPortNumberInput: travelerNr =>
    Selector(`[data-testid="traveler-travel-document-number-${travelerNr}-input"]`),
  proceedToReviewButton: Selector('[data-testid="proceed-button"]'),
  seatMapCancelButton: Selector('[data-testid="cancelSeatMap-button"]'),
  seatMapContainer: Selector('[data-testid="seatMap-container"]'),
  seatMapIcon: Selector('[data-testid="seatMap-ProductIcon"]'),
  seatMapNoButton: Selector('[data-testid="seatMap--false"]'),
  seatMapYesButton: Selector('[data-testid="seatMap--true"]'),
  secondBoundTrainIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-bound-train-icon"]',
  ),
  selfTransferHeader: Selector('[data-testid="self-transfer-header"]'),
  selfTransferHeaderClosedTrip: Selector(
    '.resultPage-flightResults-0 [data-testid="self-transfer-header"]',
  ),
  selfTransferInformationText: Selector(
    '[data-testid="travelerDetailsPage-self-transfer-guarantee"]',
  ),
  selfTransferText: Selector('[data-testid="self-transfer-content"]'),
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
  shortConnectionNotification: Selector('[data-testid="short-connection-time-notification"]'),
  simpleVisaContainer: Selector('[data-testid="simpleVisa-container"]'),
  simpleVisaNoButton: Selector('[data-testid="simpleVisa--false"]'),
  simpleVisaYesButton: Selector('[data-testid="simpleVisa--true"]'),
  smallIcons: Selector('[data-testid="expansion-panel-flight"] svg'),
  smsContainer: Selector('[data-testid="sms-container"]'),
  smsNoButton: Selector('[data-testid="sms--false"]'),
  smsYesButton: Selector('[data-testid="sms--true"]'),
  stepIndicatorCurrent: Selector('[data-testid="current-step"]'),
  stepIndicatorNotVisited: Selector('[data-testid="not-visited-step"]'),
  stepIndicatorVisited: Selector('[data-testid="visited-step"]'),
  supportPackageBasic: Selector('[for="choice.supportPackage.0"] .etiCustomRadio'),
  supportPackageBasicMobile: Selector('[for="toggleChoice.supportPackage.0"]').nth(0),
  supportPackageBasicNew: Selector('[for="toggleChoice.supportPackage.0"]').nth(1),
  supportPackageBasicStringSelector: '[for="choice.supportPackage.0"] .etiCustomRadio',
  supportPackageBasicStringMobile: '[for="toggleChoice.supportPackage.0"] .etiCustomRadio',
  supportPackageComponentNew: Selector('[data-testid="supportPackage-pack-Premium"]'),
  supportPackageContainerMobile: Selector('[data-testid="servicePackage-component"]'),
  supportPackageMobileTravelPlan: Selector(
    '[data-testid="servicePackage-mobileTravelPlan-trigger"]',
  ),
  supportPackageModalNoButton: Selector('[data-testid="servicePackageModal-decline-button"]'),
  supportPackageOnlineCheckIn: Selector('[data-testid="servicePackage-onlineCheckIn-trigger"]'),
  supportPackagePremium: Selector('[for="choice.supportPackage.62"]'),
  supportPackagePremiumIcon: Selector('[data-testid="servicePackage-ProductIcon"]'),
  supportPackagePremiumNew: Selector('[for="toggleChoice.supportPackage.62"]'),
  supportPackagePremiumSelectMobile: Selector('[for="toggleChoice.supportPackage.62"]').nth(1),
  trainSegmentIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-segment-train"] svg',
  ),
  travelerContainer: Selector('[data-testid="travelerDetails-passenger-info"]'),
  travelerDetailsForm: Selector('[data-testid="travelerDetailsForm"]'),
  travelerDetailsPage: Selector('[data-testid="travelerDetailsPage"]'),
  travelerInput: travelerNr =>
    Selector(`[data-testid="travelerDetails-traveler-${travelerNr}-section"] input`),
  travelInsuranceGeniusButtonNo: Selector('[data-testid="travelInsuranceCoverGenius--false"]'),
  travelInsuranceGeniusButtonYes: Selector('[data-testid="travelInsuranceCoverGenius--true"]'),
  travelInsuranceGeniusContainer: Selector(
    '[data-testid="coverGeniusInsurance-travelInsuranceCoverGenius-InsuranceProduct"]',
  ),
  travelInsuranceInEuNo: Selector('[data-testid="travelInsuranceInsideEu--false"]'),
  travelInsuranceInEuYes: Selector('[data-testid="travelInsuranceInsideEu--true"]'),
  travelInsuranceInsideEuContainer: Selector('[data-testid="travelInsuranceInsideEu-container"]'),
  travelInsuranceInsideEuModalYes: Selector(
    '[data-testid="travelInsuranceInsideEuModal-confirm-button"]',
  ),
  travelInsuranceOutsideEuContainer: Selector('[data-testid="travelInsuranceOutsideEu-container"]'),
  travelInsuranceOusideEuModalYes: Selector(
    '[data-testid="travelInsuranceOutsideEuModal-confirm-button"]',
  ),
  travelInsuranceOutsideEuNo: Selector('[data-testid="travelInsuranceOutsideEu--false"]'),
  travelInsuranceOutsideEuYes: Selector('[data-testid="travelInsuranceOutsideEu--true"]'),
  tripBound: Selector('[data-testid="tripDetails-bound"]'),
  tripDetailsArrow: Selector('[data-testid="expansion-panel-flight"]'),
  tripInfoText: Selector('[data-testid="tripDetails-segment-event"]'),
  tripSegment: Selector('[data-testid="tripDetails-segment"]'),
  tripSegmentFlightNr: Selector('[data-testid="tripDetails-segment-TripDetailsSegmentInfo"]'),
  tripSegFirstDestination: Selector('[data-testid="trip-segment-destination-time"]')
    .nth(0)
    .nextSibling(),
  tripSegFirstOrigin: Selector('[data-testid="trip-segment-origin-time"]')
    .nth(0)
    .nextSibling(),
  tripSegSecondDestination: Selector('[data-testid="trip-segment-destination-time"]')
    .nth(1)
    .nextSibling(),
  tripSegSecondOrigin: Selector('[data-testid="trip-segment-origin-time"]')
    .nth(1)
    .nextSibling(),
  voucherNotValidInfo: Selector('[data-testid="travelerDetailsForm-voucherNotValid"]'),
};
