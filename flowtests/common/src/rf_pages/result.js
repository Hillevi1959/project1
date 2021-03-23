/* eslint-disable no-await-in-loop */
import { t } from 'testcafe';
import resultModule from '../rf_modules/resultModule';
import { dropdownSelect } from '../util/dropdownSelect';
import { isMobile } from '../util/device';

export async function selectTripButtonByIndex(number) {
  await t.expect(resultModule.bookFlightButton.exists).ok('', { timeout: 60000 });
  await t.click(resultModule.bookFlightButton.nth(number));
}

async function chooseDatesFrom() {
  await t.click(resultModule.nextMonth);
  await t.click(resultModule.nextMonth);
  await t.click(resultModule.date.nth(10));
}

async function chooseDatesTo() {
  await t.click(resultModule.date.nth(23));
}

async function enterDates() {
  await t.click(resultModule.departureDate);
  await chooseDatesFrom();
  await t.click(resultModule.returnDate);
  await chooseDatesTo();
}

async function enterFromCity(origin) {
  await t.click(resultModule.originInput);
  await t.typeText(resultModule.originInput, origin);
  await t.pressKey('enter');
}

async function enterToCity(destination) {
  await t.click(resultModule.destinationInput);
  await t.typeText(resultModule.destinationInput, destination);
  await t.pressKey('enter');
}

export async function makeSearchResultPage(origin, destination) {
  await enterDates();
  await enterFromCity(origin);
  await enterToCity(destination);
}

export async function addSearchDataResultPage(
  numberOfAdultsToAdd,
  origin,
  destination,
  numberOfChildrenToAdd,
  numberOfInfantsToAdd,
) {
  await t.click(resultModule.searchFormButton);
  await dropdownSelect(resultModule.cabinClassDropdown, 1);
  await dropdownSelect(resultModule.travelerDropDown, 0);
  for (let i = 0; i < numberOfAdultsToAdd; i += 1) {
    await t.click(resultModule.travelerAdultsCounterPlus);
  }
  for (let i = 0; i < numberOfChildrenToAdd; i += 1) {
    await t.click(resultModule.travelerChildrenCounterPlus);
  }
  for (let i = 0; i < numberOfInfantsToAdd; i += 1) {
    await t.click(resultModule.travelerInfantsCounterPlus);
  }
  await makeSearchResultPage(origin, destination);
}

export function convertTimeToFloat(time) {
  const textTime = time.slice(1);
  const indexHour = textTime.indexOf('h');
  const indexSpace = textTime.indexOf(' ');
  const indexMin = textTime.indexOf('m');
  let minutes = '';
  let convertedTime;

  const hours = parseFloat(textTime.substring(0, indexHour));
  if (indexSpace !== -1) {
    minutes = parseFloat(textTime.substring(indexSpace + 1, indexMin)) / 60;
    convertedTime = hours + minutes;
  } else {
    convertedTime = hours;
  }
  return convertedTime;
}

export function convertTimeStampToFloat(timeStamp) {
  const indexColon = timeStamp.indexOf(':');
  const hour = parseFloat(timeStamp.substring(0, indexColon));
  const minutes = parseFloat(timeStamp.substring(indexColon + 1)) / 60;

  return parseFloat(hour) + parseFloat(minutes);
}

export function convertPricePound(stringPrice) {
  // Remove left to right character &#8234 and the £ sign
  return Number.parseFloat(stringPrice.slice(2));
}

export async function filterSasLufthansa() {
  await t.click(resultModule.toggleFilterButton);
  if (await isMobile()) {
    await t.click(resultModule.filterAirlineToggleButton);
  }
  await t.click(resultModule.clearAirlines);
  if (
    (await resultModule.filterAirlineLufthansaCheckbox.exists) &&
    (await resultModule.filterAirlineLufthansaCheckbox.visible)
  ) {
    await t.click(resultModule.filterAirlineLufthansaCheckbox);
  }
  if (
    (await resultModule.filterAirlineSasCheckbox.exists) &&
    (await resultModule.filterAirlineSasCheckbox.visible)
  ) {
    await t.click(resultModule.filterAirlineSasCheckbox);
  }
  await t.click(resultModule.toggleFilterButton);
}
