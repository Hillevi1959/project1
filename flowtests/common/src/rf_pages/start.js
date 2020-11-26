/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { t } from 'testcafe';
import { dropdownSelect } from '../util/dropdownSelect';
import startModule from '../rf_modules/startModule';
import { selectTripNumber } from './result';

export async function selectTravelers(nrOfAdults, nrOfChildren, nrOfInfants) {
  await dropdownSelect(startModule.travelerDropDown, 0);
  let i;
  if (nrOfAdults > 1) {
    for (i = 1; i < nrOfAdults; i += 1) {
      await t.click(startModule.travelerAdultsCounterPlus);
    }
  }
  if (nrOfChildren > 0) {
    for (i = 0; i < nrOfChildren; i += 1) {
      await t.click(startModule.travelerChildrenCounterPlus);
    }
  }
  if (nrOfInfants > 0) {
    for (i = 0; i < nrOfInfants; i += 1) {
      await t.click(startModule.travelerInfantsCounterPlus);
    }
  }
}

export async function selectCabinClass(cabinClass) {
  switch (cabinClass) {
    case 'ECONOMY':
      break;
    case 'PREMIUM_ECONOMY': {
      await dropdownSelect(startModule.cabinClassDropdown, 1);
      break;
    }
    default:
      break;
  }
}

export async function makeSearch(tripType, origin, destination, dayNumber) {
  await enterDates(tripType, dayNumber);
  await enterFromCity(origin);
  await enterToCity(destination);
  await t.click(startModule.searchFlight);
}

export async function searchAndSelectTrip(
  numberOfAdults,
  numberOfChildren,
  numberOfInfants,
  tripType,
  origin,
  destination,
  tripSelection,
) {
  await selectCabinClass(tripSelection);
  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  await makeSearch(tripType, origin, destination, 10);
  if (tripSelection === 'PREMIUM_ECONOMY') {
    await selectTripNumber(2);
  } else if (tripSelection === 'ReviewTrip') {
    await selectTripNumber(4);
  } else {
    await selectTripNumber(0);
  }
}

export async function searchTrip(
  numberOfAdults,
  numberOfChildren,
  numberOfInfants,
  tripType,
  origin,
  destination,
  cabinClass,
) {
  await selectCabinClass(cabinClass);
  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  await makeSearch(tripType, origin, destination, 10);
}

export async function makeSearchMultiTrip(trip1, trip2) {
  await enterDatesMultiTrip(0, 10);
  await enterCitiesMulti(trip1, 0);
  await enterDatesMultiTrip(1, 13);
  await enterCitiesMulti(trip2, 1);
  await t.click(startModule.searchFlight);
}

export async function chooseTripType(tripType) {
  if (tripType === 'one way trip') {
    await t.click(startModule.oneWayTrip);
  }
  if (tripType === 'multi trip') {
    await t.expect(startModule.multiTrip.visible).ok('', { timeout: 30000 });
    await t.click(startModule.multiTrip);
  }
}

async function chooseDate(dayNr) {
  await t.click(startModule.day.nth(dayNr));
}

async function clickNextMonth() {
  await t.click(startModule.nextMonth);
}

async function enterFromCity(origin) {
  await t.click(startModule.origin);
  await t.typeText(startModule.origin, origin);
  await t.pressKey('enter');
}

async function enterToCity(destination) {
  await t.typeText(startModule.destination, destination);
  await t.pressKey('enter');
}

async function enterDates(tripType, dayNr) {
  if (tripType === 'return trip') {
    await t.click(startModule.departureDate);
    await clickNextMonth();
    await clickNextMonth();
    await chooseDate(dayNr);
    await t.click(startModule.returnDate);
    await chooseDate(dayNr + 14);
  }
  if (tripType === 'one way trip') {
    await t.click(startModule.oneWayTrip);
    await t.click(startModule.departureDate);
    await clickNextMonth();
    await clickNextMonth();
    await chooseDate(dayNr);
  }
}

async function enterDatesMultiTrip(tripNr, dayNr) {
  await t.click(startModule.setMultiTripDate(tripNr));
  if (tripNr === 0) {
    await clickNextMonth();
  }
  await chooseDate(dayNr);
}

async function enterCitiesMulti(trip, tripNr) {
  await t.click(startModule.setMultiTripOrigin(tripNr));
  await t.typeText(startModule.setMultiTripOrigin(tripNr), trip[0]);
  await t.pressKey('enter');
  await t.click(startModule.setMultiTripDestination(tripNr));
  await t.typeText(startModule.setMultiTripDestination(tripNr), trip[1]);
  await t.pressKey('enter');
}

export async function closeHeaderUrgencyBanner() {
  if (await startModule.headerUrgencyBanner.exists) {
    await t.click(startModule.headerUrgencyBanner);
  }
}
