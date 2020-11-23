import { Selector } from 'testcafe';

export default {
  bookFlightButton: Selector('[data-testid="resultPage-book-button"]'),
  bookFlightWithFlexibleTicketButton: Selector('[data-testid="resultPage-book-button"]').nth(1),
  cabinClassDropdown: Selector('[data-testid="searchForm-cabinClasses-dropdown"]'),
  campaignFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(1),
  cheapestFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(2),
  clearAirlines: Selector(
    '[data-testid="resultPage-AIRLINESFilter-content"] > div > span:nth-child(1)',
  ),
  day: Selector('.DayPicker-Day'),
  destinationInput: Selector('[data-testid="searchForm-singleBound-destination-input"]'),
  departureDate: Selector('[data-testid="singleBound.departureDate-input"]'),
  discountInformation: Selector('[data-testid="payment-method-discount-info"]'),
  filterMaxStopToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-MAX_STOPSToggleButton-button"]',
  ),
  filterDirectButton: Selector('[data-testid="MAX_STOPS-direct"]'),
  filterMaxOneStopButton: Selector('[data-testid="MAX_STOPS-max1"]'),
  filterAllButton: Selector('[data-testid="MAX_STOPS-all"]'),
  filterAllButtonId: Selector('#MAX_STOPS_all'),
  filterContent: Selector('[data-testid="resultPage-searchFilters-content"]'),
  filterAirlineToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-AIRLINESToggleButton-button"]',
  ),
  filterAirlineLufthansaCheckbox: Selector('#airline-LH'),
  filterAirlineSasCheckbox: Selector('#airline-SK'),
  filterArrivalSecondBoundRadioButton: Selector(
    '[data-testid="resultPage-departureArrivalFilter-arrival1-radio"]',
  ),
  filterArrivalTimeSecondBound: Selector(
    '[data-testid="resultPage-departureArrivalFilter-arrival1-slider"] .slider-tracks',
  ),
  filterArrivalSecondBoundRightSlider: Selector(
    '[data-testid="resultPage-departureArrivalFilter-arrival1-slider"] [data-testid="handle-1"]',
  ),
  filterDepartureFirstBoundLeftSlider: Selector(
    '[data-testid="resultPage-departureArrivalFilter-departure0-slider"] [data-testid="handle-0"]',
  ),
  filterDepartureTimeFirstBound: Selector(
    '[data-testid="resultPage-departureArrivalFilter-departure0-slider"] .slider-tracks',
  ),
  filterDepArrFirstBoundToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-departureArrival0ToggleButton-button"]',
  ),
  filterDepArrSecondBoundToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-departureArrival1ToggleButton-button"]',
  ),
  filterPriceToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-PRICEToggleButton-button"]',
  ),
  filterPriceSliderRight: Selector(
    '[data-testid="resultPage-PRICEFilter-content"] [data-testid="handle-1"]',
  ),
  filterPriceMaxLabel: Selector('[data-testid="resultPage-PRICEFilter-content"] div').nth(8),
  filterMaxStopResetButton: Selector(
    '[data-testid="resultPage-filterHeader-MAX_STOPSFilterResetButton-button"]',
  ),
  filterResetButton: Selector(
    '[data-testid="resultPage-filterHeader-allFilterResetButton-button"]',
  ),
  filterTravelTimeToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-TRAVEL_TIMEToggleButton-button"]',
  ),
  filterTravelTimeSlider: Selector(
    '[data-testid="resultPage-TRAVEL_TIMEFilter-content"] [data-testid="handle-0"]',
  ),
  headerNavigationMenu: Selector('[data-testid="siteheader-button"]'),
  nextMonth: Selector('[data-testid="searchForm-nextMonth-input"]'),
  openFlightButton: Selector('[data-testid="searchResults-arrowDown-button"]'),
  originInput: Selector('[data-testid="searchForm-singleBound-origin-input"]'),
  owcInformation: Selector('[data-testid="tripDetails-oneWayCombination-wrapper"]'),
  planeTrainStandardIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="result-bookButton-planeTrainStandardIcon"]',
  ),
  productBundleOption3: Selector('[data-testid="productBundleItem-3"]'),
  productBundleOption3Button: Selector('[for="choice.flexibleTicketBundle.3"]'),
  productBundleConfirmationButton: Selector(
    '[data-testid="productBundle-flexibleTicketBundle-confirmation-button"]',
  ),
  returnDate: Selector('[data-testid="singleBound.returnDate-input"]'),
  recommendedFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(0),
  resultPage: Selector('[data-testid="resultPage-searchResults"]'),
  searchForm: Selector('[data-testid="resultPage-searchForm-content"]'),
  searchFlight: Selector('[data-testid="searchForm-searchFlights-button"]'),
  searchFormButton: Selector('[data-testid="resultPage-searchHeaderButton-button"]'),
  selfTransferTrip: Selector(
    '[data-testid*="resultPage-resultTrip-"] [data-testid="self-transfer-header"]',
  ),
  selfTransferText: Selector(
    '[data-testid*="resultPage-resultTrip-"] [data-testid="self-transfer-content"]',
  ),
  segmentTrainIcon: Selector('[data-testid="tripDetails-segment-train"]'),
  shortestFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(3),
  smallPlaneIcon: Selector('[data-testid="tripDetails-bound-plane-icon"]'),
  smallTrainIcon: Selector('[data-testid="tripDetails-bound-train-icon"]'),
  timeStampSegmentOrigin: Selector('[data-testid="trip-segment-origin-time"]'),
  timeStampSegmentDestination: Selector('[data-testid="trip-segment-destination-time"]'),
  firstBoundPlaneIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="tripDetails-bound"]:nth-child(1) [data-testid="tripDetails-bound-plane-icon"]',
  ),
  secondBoundTrainIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-bound-train-icon"]',
  ),
  trainSegmentIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-segment-train"] svg',
  ),
  tripDetailBound: Selector('[data-testid="tripDetails-bound"]'),
  tripInfoText: Selector('.resultPage-flightResults-4 [data-testid="tripDetails-segment-event"]'),
  tripPriceStandard: Selector('[data-test-id="result-trip-price-standard"]'),
  tripTitleFlight: Selector('[data-testid="tripDetails-title-TitleText"]'),
  tripTitleDate: Selector('[data-testid="tripDetails-title-date-desktop"]'),
  tripTitleDateMobile: Selector('[data-testid="tripDetails-title-date-mobile"]'),
  toggleFilterButton: Selector('[data-testid="resultPage-toggleFiltersButton-button"]'),
  topTripHeader: Selector('[data-testid="result-tripHeader-title"]'),
  travelerDropDown: Selector('[data-testid="searchForm-passengers-dropdown"]'),
  travelTimeDuration: Selector('[data-testid="searchResults-segment-duration"]'),
  travelerAdultsCounterPlus: Selector('[data-testid="adults-option"] .etiCounter__button--plus'),
  travelerChildrenCounterPlus: Selector(
    '[data-testid="children-option"] .etiCounter__button--plus',
  ),
  travelerInfantsCounterPlus: Selector('[data-testid="infants-option"] .etiCounter__button--plus'),
  resultBookButtons: Selector('[data-testid="result-bookButtons-wrapper"]'),
  tripChange: Selector('[data-testid="searchResults-segment-stops"]'),
  tripInformationHeader: Selector('.header'),
  tripSegment: Selector('[data-testid="tripDetails-segment"]'),
  voucherSwitch: Selector('[data-testid="slider-valid-with-voucher-switch"]'),
  childAgeCounterPlus: childNr =>
    Selector(`[data-testid="child-${childNr}-age-option"] .etiCounter__button--plus`),
  infantAgeCounterPlus: infantNr =>
    Selector(`[data-testid="infant-${infantNr}-age-option"] .etiCounter__button--plus`),
  toggleTrip: tripNumber => `[data-testid="resultPage-resultTrip-${tripNumber}-wrapper"]`,
  tripWithVoucherTag: tripNumber =>
    `[data-testid*="resultPage-resultTrip-${tripNumber}"] [data-testid="valid-with-voucher-tag"]`,
};
