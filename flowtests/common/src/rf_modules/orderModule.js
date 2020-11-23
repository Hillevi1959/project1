import { Selector } from 'testcafe';

export default {
  allProductsInOrder: Selector('[data-testid="cart-content-products"] li'),
  baggageDetails: Selector('[data-testid*="travelerList-segment"]'),
  cabinClassInfo: Selector('[data-testid="tripDetails-segment-cabinClass"]'),
  companyInformationAddress: Selector('[data-testid="company.streetAddress-input"]'),
  companyInformationCompanyAddress: Selector('[data-testid="company.companyAddress-input"]'),
  companyInformationCity: Selector('[data-testid="company.city-input"]'),
  companyInformationZipCode: Selector('[data-testid="company.zipCode-input"]'),
  companyInformationName: Selector('[data-testid="company.companyName-input"]'),
  companyInformationVatNumber: Selector('[data-testid="company.vatNumber-input"]'),
  cartCheckInProduct: Selector('[data-testid="cart-product-onlineCheckIn"]'),
  cartAllInclusiveProduct: Selector('[data-testid="cart-product-allInclusiveProtection"]'),
  cartAllInclusivePrice: Selector('[data-testid="cart-product-allInclusiveProtection-price"]'),
  cartCheckinBaggageProduct: Selector('[data-testid="cart-product-checkInBaggage"]'),
  cartItem: Selector('.etiCartItem'),
  cartTagIcon: Selector('[data-testId="cart-tag-icon"]'),
  cartFlexTicketProduct: Selector('[data-testid="cart-product-flexibleTicket"]'),
  cartMobileTravelPlanProduct: Selector('[data-testid="cart-product-mobileTravelPlan"]'),
  cartSmsProduct: Selector('[data-testid="cart-product-sms"]'),
  cartSupportPackageProduct: Selector('[data-testid="cart-product-servicePackage"]'),
  cartTripCancellationProduct: Selector('[data-testid="cart-product-tripCancellationProtection"]'),
  cartTripCancellationPrice: Selector(
    '[data-testid="cart-product-tripCancellationProtection-price"]',
  ),
  cc2cEntries: Selector('[data-testid="cc2carrier-transaction-entry"]'),
  downloadTripDocument: Selector('[data-testid="traveldoc-link"]'),
  flightInfoButton: Selector('[data-testid="order-show-flight-info-button"]'),
  infoTextOrderPage: Selector('[data-testid="order-page"] .etiContentWrapper span').nth(0),
  mailConfirmationButton: Selector('[data-testid="mailConfirmation-button"]'),
  moreInfoButton: Selector('[data-testid="order-lccinfo-toggle-button"]'),
  myBookingsButton: Selector('[data-testid="my-bookings-large"]'),
  myBookingsButtonMobile: Selector('[data-testid="myBookings-dropdown-small"]'),
  myBookingsButtonOrderPage: Selector('[data-testid="myBookings-dropdown-large"]'),
  myBookingsEmailInput: Selector('[data-testid="email-input"]'),
  myBookingsOrderNumberInput: Selector('[data-testid="orderNumber-input"]'),
  myBookingsLogInButton: Selector('[data-testid="login-button"]'),
  myBookingsLogOutButton: Selector('[data-testid="myBookings-logout"]'),
  orderInfoTrip: Selector('[data-testid="cart-content-Trip"]'),
  orderNumber: Selector('[data-testid="orderPage-ReceiptInformation-orderNumber"]'),
  orderPage: Selector('[data-testid="order-page"]'),
  owcInformation: Selector('[data-testid="tripDetails-oneWayCombination-wrapper"]'),
  printConfirmationButton: Selector('[data-testid="printConfirmation-button"]'),
  printBusinessReceiptButton: Selector('[data-testid="receiptPrintModal-printCompany-button"]'),
  postBookingProducts: Selector('[data-testid="orderPage-postBooking-product"]'),
  receiptInformation: Selector('[data-testid="orderPage-ReceiptInformation-section"]'),
  seatMapProduct: Selector('[data-testid="cart-product-seatMap"]'),
  seeAllProductsButton: Selector('[data-testid="order-postBooking-link"]'),
  selfServiceRebookingImage: Selector('[data-testid="image-panel"]'),
  selfServiceRebookingInfoText: Selector('.etiHtmlContent p').nth(1),
  selfTransferInformationText: Selector(
    '[data-testid="orderPage-self-guarantee-info-TripNotification"]',
  ),
  selfTransferHeader: Selector('[data-testid="self-transfer-header"]'),
  selfTransferText: Selector('[data-testid="self-transfer-content"]'),
  shortConnectionNotification: Selector('[data-testid="short-connection-time-notification"]'),
  showBaggageButton: Selector('[data-testid="order-show-baggage-info-button"]'),
  firstBoundPlaneIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(1) [data-testid="tripDetails-bound-plane-icon"]',
  ),
  secondBoundTrainIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-bound-train-icon"]',
  ),
  trainTripSecondBoundTrainSegmentIcon: Selector(
    '[data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-segment-train"]',
  ),
  travelDocumentButton: Selector('[data-testid="traveldoc-link"]'),
  travelerInfo: Selector('[data-testid*="payment-tripdetails-traveler-"]'),
  travelerPriceInfo: Selector('[data-testid="traveler-price-info"]'),
  tripBound: Selector('[data-testid="tripDetails-bound"]'),
  tripSegment: Selector('[data-testid="tripDetails-segment"]'),
  tripInformation: Selector('.etiCartContent .etiCartItem'),
  tripInfoText: Selector('[data-testid="tripDetails-segment-event"]'),
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
};
