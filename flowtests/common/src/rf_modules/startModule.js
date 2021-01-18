import { Selector } from 'testcafe';

export default {
  airSystemIbeDummy: Selector('[for="dbg_onlyRsrvSys110"]'),
  airSystemIbeGDSDummy: Selector('[for=dbg_onlyRsrvSys111]'),
  cabinClassDropdown: Selector('[data-testid="searchForm-cabinClasses-dropdown"]'),
  date: Selector('[aria-disabled="false"]'),
  day: Selector('.DayPicker-Day'),
  destination: Selector('[data-testid="searchForm-singleBound-destination-input"]'),
  departureDate: Selector('[data-testid="singleBound.departureDate-input"]'),
  directFlightBox: Selector('[data-testid="directFlight-input"]'),
  headerUrgencyBanner: Selector('[data-testid="top-header-notification-close-button"]'),
  multiTrip: Selector('[for="multi_stop"]'),
  nextMonth: Selector('[data-testid="searchForm-nextMonth-input"]'),
  oneWayTrip: Selector('.etiRadioLabel').nth(1),
  oneWayTripButton: Selector('[data-testid="searchForm-oneWay-radio"]'),
  origin: Selector('[data-testid="searchForm-singleBound-origin-input"]', { timeout: 10000 }),
  returnDate: Selector('[data-testid="singleBound.returnDate-input"]'),
  searchFlight: Selector('[data-testid="searchForm-searchFlights-button"]'),
  setMultiTripDate: tripNr => Selector(`[data-testid="multiBound[${tripNr}].departureDate-input"]`),
  setMultiTripDestination: tripNr =>
    Selector(`[data-testid="searchForm-multiBound[${tripNr}]-destination-input"]`),
  setMultiTripOrigin: tripNr =>
    Selector(`[data-testid="searchForm-multiBound[${tripNr}]-origin-input"]`),
  startPageSearchForm: Selector('[data-testid="searchPage-searchForm"]'),
  travelerAdultsCounterPlus: Selector('[data-testid="adults-option"] .etiCounter__button--plus'),
  travelerChildrenCounterMinus: Selector(
    '[data-testid="children-option"] .etiCounter__button--minus',
  ),
  travelerChildrenCounterPlus: Selector(
    '[data-testid="children-option"] .etiCounter__button--plus',
  ),
  travelerDropDown: Selector('[data-testid="searchForm-passengers-dropdown"]'),
  travelerInfantsCounterMinus: Selector(
    '[data-testid="infants-option"] .etiCounter__button--minus',
  ),
  travelerInfantsCounterPlus: Selector('[data-testid="infants-option"] .etiCounter__button--plus'),
  voucherMessage1: Selector('[data-testid="searchPage-searchForm"] div h2'),
  voucherMessage2: Selector('[data-testid="searchPage-searchForm"] div .etiHtmlContent'),
};
