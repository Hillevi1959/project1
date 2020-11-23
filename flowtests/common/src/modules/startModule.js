import { Selector } from 'testcafe';

export default {
  passengerDropDown: Selector('.passengersDropdownButton'),
  adultPlusButton: Selector(
    '.adultsSelection .passengersDropdown__counterButton.counterPlusButton',
  ),
  childPlusButton: Selector(
    '.childrenSelection .passengersDropdown__counterButton.counterPlusButton',
  ),
  ageMinusButton: Selector(
    '.childAgeSelection .passengersDropdown__counterButton.counterMinusButton',
  ),
  agePlusButton: Selector(
    '.childAgeSelection .passengersDropdown__counterButton.counterPlusButton',
  ),
  searchFlight: Selector('#airSubmitButtonId'),
  searchFlightMobile: Selector('.airSearchSubmitButton'),
  debugInfoTrip: Selector('.expandableDebugInfoTODO .debugHeaderCells').nth(0),
  overNightStay: Selector('.informationItem.OvernightStay.enableTooltip').nth(0),
  oneWayTrip: Selector('[for="tripTypeRadioButton_TRIP_TYPE_ONEWAY"]'),
  mulitDestinationButton: Selector('[for="tripTypeRadioButton_TRIP_TYPE_MULTI_DESTINATION"]'),
  multiDateLabel: Selector('.dateFields'),
  departureDate: Selector('#visualDepartureDate'),
  returnDate: Selector('#visualReturnDate'),
  nextMonth: Selector('.DayPicker-NavButton--next'),
  multiNextMonth: Selector('.DayPicker-NavButton.DayPicker-NavButton--next'),
  day: Selector('.DayPicker-Day'),
  origin: Selector('.originCitySelection input'),
  destination: Selector('.destinationCitySelection input'),
  multiStopOrigin: Selector('.originCitySelection'),
  multiStopDestination: Selector('.destinationCitySelection'),
  airSystemIbeDummy: Selector('[for="dbg_onlyRsrvSys110"]'),
  airSystemIbeGDSDummy: Selector('[for=dbg_onlyRsrvSys111]'),
  directFlightBox: Selector('[for="directFlightSelectionCheckbox"]'),
};
