/* eslint-disable no-await-in-loop */
import { Selector, t } from 'testcafe';
import start from '../modules/startModule';

async function clickAge(ages) {
  let y;
  for (let x = 0; x < ages.length; x += 1) {
    if (ages[x] < 7) {
      for (y = 0; y < 7 - ages[x]; y += 1) {
        await t.click(Selector(start.ageMinusButton).nth(x));
      }
    }
    if (ages[x] > 7) {
      for (y = 0; y < ages[x] - 7; y += 1) {
        await t.click(Selector(start.agePlusButton).nth(x));
      }
    }
  }
}

export async function selectTravelersDesktop(nrOfAdults, nrOfChildren, ages) {
  await t.click(start.passengerDropDown);
  if (nrOfAdults > 1) {
    for (let i = 1; i < nrOfAdults; i += 1) {
      await t.click(start.adultPlusButton);
    }
  }
  if (nrOfChildren > 0) {
    for (let i = 0; i < nrOfChildren; i += 1) {
      await t.click(start.childPlusButton);
    }
    await clickAge(ages);
  }
}

export async function selectProvider(providers) {
  for (const provider of providers) {
    if (provider === 'IbeDummy') {
      await t.click(start.airSystemIbeDummy);
    } else if (provider === 'IbeGDSDummy') {
      await t.click(start.airSystemIbeGDSDummy);
    }
  }
}

async function enterFromCity(origin) {
  await t.typeText(start.origin, origin);
  await t.pressKey('enter');
}

async function enterToCity(destination) {
  await t.typeText(start.destination, destination);
  await t.pressKey('enter');
}

async function chooseDatesFrom() {
  await t.click(start.nextMonth);
  await t.click(start.nextMonth);
  await t.click(start.day.nth(10));
}

async function chooseDatesTo() {
  await t.click(start.day.nth(24));
}

async function enterDates(tripType) {
  if (tripType === 'return trip') {
    await t.click(start.departureDate);
    await chooseDatesFrom();
    await t.click(start.returnDate);
    await chooseDatesTo();
  }

  if (tripType === 'one way trip') {
    await t.click(start.departureDate);
    await chooseDatesFrom();
  }
}

export async function makeSearch(tripType, origin, destination) {
  await enterFromCity(origin);
  await enterToCity(destination);
  await enterDates(tripType);
  await t.click(start.searchFlight);
}
