import { Selector } from 'testcafe';

export default {
  bookFlightButton: Selector('[data-testid="resultPage-book-button"]'),
  bookFlightWithFlexibleTicketButton: Selector('[data-testid="resultPage-book-button"]').nth(1),
  cabinClassDropdown: Selector('[data-testid="searchForm-cabinClasses-dropdown"]'),
  cheapestFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(2),
  childAgeCounterPlus: childNr =>
    Selector(`[data-testid="child-${childNr}-age-option"] .etiCounter__button--plus`),
  clearAirlines: Selector(
    '[data-testid="resultPage-AIRLINESFilter-content"] > div > span:nth-child(1)',
  ),
  date: Selector('[aria-disabled="false"]'),
  day: Selector('.DayPicker-Day'),
  destinationInput: Selector('[data-testid="searchForm-singleBound-destination-input"]'),
  departureDate: Selector('[data-testid="singleBound.departureDate-input"]'),
  discountInformation: Selector('[data-testid="payment-method-discount-info"]'),
  filterAirlineLufthansaCheckbox: Selector('[for="airlines-LH"]'),
  filterAirlineMauritiusCheckbox: Selector('[for="airlines-MK"]'),
  filterAirlineSasCheckbox: Selector('[for="airlines-SK"]'),
  filterAirlineToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-AIRLINESToggleButton-button"]',
  ),
  filterAllButton: Selector('[data-testid="MAX_STOPS-all"]'),
  filterAllButtonId: Selector('#MAX_STOPS_all'),
  filterArrivalSecondBoundRadioButton: Selector(
    '[data-testid="resultPage-departureArrivalFilter-arrival1-radio"]',
  ),
  filterArrivalSecondBoundRightSlider: Selector(
    '[data-testid="resultPage-departureArrivalFilter-arrival1-slider"] [data-testid="handle-1"]',
  ),
  filterArrivalTimeSecondBound: Selector(
    '[data-testid="resultPage-departureArrivalFilter-arrival1-slider"] .slider-tracks',
  ),
  filterContent: Selector('[data-testid="resultPage-searchFilters-content"]'),
  filterDepArrFirstBoundToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-departureArrival0ToggleButton-button"]',
  ),
  filterDepArrSecondBoundToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-departureArrival1ToggleButton-button"]',
  ),
  filterDepartureTimeFirstBound: Selector(
    '[data-testid="resultPage-departureArrivalFilter-departure0-slider"] .slider-tracks',
  ),
  filterDepartureFirstBoundLeftSlider: Selector(
    '[data-testid="resultPage-departureArrivalFilter-departure0-slider"] [data-testid="handle-0"]',
  ),
  filterDirectButton: Selector('[data-testid="MAX_STOPS-direct"]'),
  filterMaxOneStopButton: Selector('[data-testid="MAX_STOPS-max1"]'),
  filterMaxStopResetButton: Selector(
    '[data-testid="resultPage-filterHeader-MAX_STOPSFilterResetButton-button"]',
  ),
  filterMaxStopToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-MAX_STOPSToggleButton-button"]',
  ),
  filterPriceMaxLabel: Selector('[data-testid="resultPage-PRICEFilter-content"] div').nth(9),
  filterPriceSliderRight: Selector(
    '[data-testid="resultPage-PRICEFilter-content"] [data-testid="handle-1"]',
  ),
  filterPriceToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-PRICEToggleButton-button"]',
  ),
  filterResetButton: Selector(
    '[data-testid="resultPage-filterHeader-allFilterResetButton-button"]',
  ),
  filterTravelTimeSlider: Selector(
    '[data-testid="resultPage-TRAVEL_TIMEFilter-content"] [data-testid="handle-0"]',
  ),
  filterTravelTimeToggleButton: Selector(
    '[data-testid="resultPage-filterHeader-TRAVEL_TIMEToggleButton-button"]',
  ),
  firstBoundPlaneIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="tripDetails-bound"]:nth-child(1) [data-testid="tripDetails-bound-plane-icon"]',
  ),
  headerNavigationMenu: Selector('[data-testid="siteheader-button"]'),
  infantAgeCounterPlus: infantNr =>
    Selector(`[data-testid="infant-${infantNr}-age-option"] .etiCounter__button--plus`),
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
  recommendedFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(0),
  resultBookButtons: Selector('[data-testid="result-bookButtons-wrapper"]'),
  resultPage: Selector('[data-testid="resultPage-searchResults"]'),
  returnDate: Selector('[data-testid="singleBound.returnDate-input"]'),
  searchFlight: Selector('[data-testid="searchForm-searchFlights-button"]'),
  searchForm: Selector('[data-testid="resultPage-searchForm-content"]'),
  searchFormButton: Selector('[data-testid="resultPage-searchHeaderButton-button"]'),
  secondBoundTrainIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-bound-train-icon"]',
  ),
  segmentTrainIcon: Selector('[data-testid="tripDetails-segment-train"]'),
  selfTransferText: Selector(
    '[data-testid*="resultPage-resultTrip-"] [data-testid="self-transfer-content"]',
  ),
  selfTransferTrip: Selector(
    '[data-testid*="resultPage-resultTrip-"] [data-testid="self-transfer-header"]',
  ),
  shortestFilterButton: Selector('[data-testid="result-quick-sort-button"]').nth(3),
  smallPlaneIcon: Selector('[data-testid="tripDetails-bound-plane-icon"]'),
  smallTrainIcon: Selector('[data-testid="tripDetails-bound-train-icon"]'),
  timeStampSegmentDestination: Selector('[data-testid="trip-segment-destination-time"]'),
  timeStampSegmentOrigin: Selector('[data-testid="trip-segment-origin-time"]'),
  toggleFilterButton: Selector('[data-testid="resultPage-toggleFiltersButton-button"]'),
  toggleTrip: tripNumber => `[data-testid="resultPage-resultTrip-${tripNumber}-wrapper"]`,
  topTripHeader: Selector('[data-testid="result-tripHeader-title"]'),
  trainSegmentIcon: Selector(
    '.resultPage-flightResults-0 [data-testid="tripDetails-bound"]:nth-child(2) [data-testid="tripDetails-segment-train"] svg',
  ),
  travelerAdultsCounterPlus: Selector('[data-testid="adults-option"] .etiCounter__button--plus'),
  travelerChildrenCounterPlus: Selector(
    '[data-testid="children-option"] .etiCounter__button--plus',
  ),
  travelerDropDown: Selector('[data-testid="searchForm-passengers-dropdown"]'),
  travelerInfantsCounterPlus: Selector('[data-testid="infants-option"] .etiCounter__button--plus'),
  travelTimeDuration: Selector('[data-testid="searchResults-segment-duration"]'),
  tripBounds: tripNumber =>
    Selector(
      `[data-testid="resultPage-resultTrip-${tripNumber}-wrapper"] [data-testid="tripDetails-bound"]`,
    ),
  tripChange: Selector('[data-testid="searchResults-segment-stops"]'),
  tripDetailBound: Selector('[data-testid="tripDetails-bound"]'),
  tripInformationHeader: Selector('.header'),
  tripInfoText: Selector('.resultPage-flightResults-4 [data-testid="tripDetails-segment-event"]'),
  tripPriceFlex: Selector('[data-testid="result-trip-price-flex"]'),
  tripPriceStandard: Selector('[data-testid="result-trip-price-standard"]'),
  tripSegment: Selector('[data-testid="tripDetails-segment"]'),
  tripSegments: tripNumber =>
    Selector(
      `[data-testid="resultPage-resultTrip-${tripNumber}-wrapper"] [data-testid="tripDetails-segment"]`,
    ),
  tripTitleDate: Selector('[data-testid="tripDetails-title-date-desktop"]'),
  tripTitleDateMobile: Selector('[data-testid="tripDetails-title-date-mobile"]'),
  tripTitleFlight: Selector('[data-testid="tripDetails-title-TitleText"]'),
  tripWithVoucherTag: tripNumber =>
    `[data-testid*="resultPage-resultTrip-${tripNumber}"] [data-testid="valid-with-voucher-tag"]`,
  voucherFlexPrice: Selector('[data-testid="result-trip-discounted-price-flex"]'),
  voucherStandardPrice: Selector('[data-testid="result-trip-discounted-price-standard"]'),
  voucherSwitch: Selector('[data-testid="slider-valid-with-voucher-switch"]'),
};
