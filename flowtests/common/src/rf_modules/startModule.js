import { Selector } from 'testcafe';

export default {
  airSystemIbeDummy: Selector('[for="dbg_onlyRsrvSys110"]'),
  airSystemIbeGDSDummy: Selector('[for=dbg_onlyRsrvSys111]'),
  cabinClassDropdown: Selector('[data-testid="searchForm-cabinClasses-dropdown"]'),
  headerUrgencyBanner: Selector('[data-testid="top-header-notification-close-button"]'),
  day: Selector('.DayPicker-Day'),
  destination: Selector('[data-testid="searchForm-singleBound-destination-input"]'),
  departureDate: Selector('[data-testid="singleBound.departureDate-input"]'),
  directFlightBox: Selector('[data-testid="directFlight-input"]'),
  multiTrip: Selector('[for="multi_stop"]'),
  nextMonth: Selector('[data-testid="searchForm-nextMonth-input"]'),
  oneWayTrip: Selector('.etiRadioLabel').nth(1),
  oneWayTripButton: Selector('[data-testid="searchForm-oneWay-radio"]'),
  origin: Selector('[data-testid="searchForm-singleBound-origin-input"]', { timeout: 10000 }),
  returnDate: Selector('[data-testid="singleBound.returnDate-input"]'),
  searchFlight: Selector('[data-testid="searchForm-searchFlights-button"]'),
  startPageSearchForm: Selector('[data-testid="searchPage-searchForm"]'),
  travelerDropDown: Selector('[data-testid="searchForm-passengers-dropdown"]'),
  travelerAdultsCounterPlus: Selector('[data-testid="adults-option"] .etiCounter__button--plus'),
  travelerChildrenCounterPlus: Selector(
    '[data-testid="children-option"] .etiCounter__button--plus',
  ),
  travelerChildrenCounterMinus: Selector(
    '[data-testid="children-option"] .etiCounter__button--minus',
  ),
  travelerInfantsCounterPlus: Selector('[data-testid="infants-option"] .etiCounter__button--plus'),
  travelerInfantsCounterMinus: Selector(
    '[data-testid="infants-option"] .etiCounter__button--minus',
  ),
  setMultiTripOrigin: tripNr =>
    Selector(`[data-testid="searchForm-multiBound[${tripNr}]-origin-input"]`),
  setMultiTripDestination: tripNr =>
    Selector(`[data-testid="searchForm-multiBound[${tripNr}]-destination-input"]`),
  setMultiTripDate: tripNr => Selector(`[data-testid="multiBound[${tripNr}].departureDate-input"]`),
};
