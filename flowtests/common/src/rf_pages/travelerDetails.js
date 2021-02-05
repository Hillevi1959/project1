/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import { t } from 'testcafe';
import travelerDetailsModule from '../rf_modules/travelerDetailsModule';
import dateToYMD, { dateToDDMMYYYY } from '../util/dateFunction';
import { isDesktop, isMobile, isTablet } from '../util/device';
import { scrollToElement } from '../util/clientFunction';
import { dropdownSelect } from '../util/dropdownSelect';

export async function addContact(traveler) {
  await t.expect(travelerDetailsModule.contactPersonMail.exists).ok('', { timeout: 30000 });
  await scrollToElement('[for="traveler-mail"]');
  await t.click(travelerDetailsModule.contactPersonMail).pressKey('ctrl+a delete');
  await t.typeText(travelerDetailsModule.contactPersonMail, traveler.email);
  await scrollToElement('[for="traveler-phone"]');
  await t.click(travelerDetailsModule.contactPersonPhone).pressKey('ctrl+a delete');
  await t.typeText(travelerDetailsModule.contactPersonPhone, traveler.phone);
}

function getDateOfBirth(age, dateFormat) {
  const now = new Date(Date.now());
  let dateOfBirth;

  if (age === 0) {
    now.setMonth(now.getMonth() - 6);
    if (dateFormat === 'DDMMYYYY') {
      dateOfBirth = dateToDDMMYYYY(now);
    } else {
      dateOfBirth = dateToYMD(now);
    }
  } else if (age >= 1) {
    now.setFullYear(now.getFullYear() - age);
    if (dateFormat === 'DDMMYYYY') {
      dateOfBirth = dateToDDMMYYYY(now);
    } else {
      dateOfBirth = dateToYMD(now);
    }
  }
  return dateOfBirth;
}

function getExpiryDate(dateFormat) {
  const now = new Date(Date.now());
  now.setFullYear(now.getFullYear() + 5);
  let expiryDate;
  if (dateFormat === 'DDMMYYYY') {
    expiryDate = dateToDDMMYYYY(now);
  } else {
    expiryDate = dateToYMD(now);
  }
  return expiryDate;
}

export async function addTraveler(traveler, dateFormat) {
  await scrollToElement(`[data-testid="traveler-firstName-${traveler.nr}-input"]`);
  await t.click(travelerDetailsModule.setFirstName(traveler.nr)).pressKey('ctrl+a delete');
  await t.typeText(travelerDetailsModule.setFirstName(traveler.nr), traveler.firstName);
  await t.click(travelerDetailsModule.setLastName(traveler.nr)).pressKey('ctrl+a delete');
  await t.typeText(travelerDetailsModule.setLastName(traveler.nr), traveler.lastName);
  await t.click(travelerDetailsModule.setGender(traveler.gender, traveler.nr));
  if (
    (await travelerDetailsModule.setDateOfBirth(traveler.nr).exists) &&
    (await travelerDetailsModule.setDateOfBirth(traveler.nr).visible)
  ) {
    await scrollToElement(`[data-testid="traveler-date-of-birth-form-${traveler.nr}-input"]`);
    const dateOfBirth = getDateOfBirth(parseInt(traveler.age, 10), dateFormat);
    await t.click(travelerDetailsModule.setDateOfBirth(traveler.nr)).pressKey('ctrl+a delete');
    await t.typeText(travelerDetailsModule.setDateOfBirth(traveler.nr), dateOfBirth);
  }
}

export async function addTravelerInformation(travelers, dateFormat) {
  await t.expect(travelerDetailsModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await addContact(travelers[0]);
  for (const traveler of travelers) {
    await addTraveler(traveler, dateFormat);
  }
}

export async function bookFlight() {
  await scrollToElement('[data-testid="bookNow-button"]');
  await t.expect(travelerDetailsModule.bookButton.hasAttribute('disabled')).notOk();
  await t.click(travelerDetailsModule.bookButton);
}

async function getTotalCartPrice() {
  let tripTotalPrice;
  if ((await isMobile()) || (await isTablet())) {
    await t.expect(travelerDetailsModule.cartTripPriceMobile.exists).ok();
    tripTotalPrice = await travelerDetailsModule.cartTripPriceMobile.innerText;
    return tripTotalPrice;
  }
  if (await isDesktop()) {
    await t.expect(travelerDetailsModule.cartTripPrice.exists).ok('', { timeout: 5000 });
    tripTotalPrice = await travelerDetailsModule.cartTripPrice.innerText;
    return tripTotalPrice;
  }
}

export async function getTotalPriceForTrip() {
  const tripPrice = await getTotalCartPrice();
  const indexStart = 0;
  const indexEnd = tripPrice.search(' SEK');

  return tripPrice.substring(indexStart, indexEnd);
}

export async function getNumberOfBounds() {
  return await travelerDetailsModule.tripBound.count;
}

export async function getNumberOfSegments() {
  return await travelerDetailsModule.tripSegment.count;
}

export async function toggleCart() {
  const transformStyle = await travelerDetailsModule.cartBannerMobile.getStyleProperty('transform');
  if (transformStyle === 'none') {
    await t.click(travelerDetailsModule.cartBannerMobile);
  } else {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
}

export async function closeCart() {
  await t.click(travelerDetailsModule.cartCloseButtonMobile);
}

export async function toggleTripDetailsTravelerDetails() {
  await t.click(travelerDetailsModule.tripDetailsArrow);
}

export async function addPassportInformation(travelers, fillExpiryDate, dateFormat) {
  for (const traveler of travelers) {
    await t.click(travelerDetailsModule.passPortNumberInput(traveler.nr)).pressKey('ctrl+a delete');
    await t.typeText(travelerDetailsModule.passPortNumberInput(traveler.nr), traveler.passPortNr);
    if (fillExpiryDate) {
      const expiryDate = getExpiryDate(dateFormat);
      await t.typeText(travelerDetailsModule.expiryDateInput(traveler.nr), expiryDate);
    }
  }
}

export async function clickProceedToReviewButton() {
  await scrollToElement('[data-testid="proceed-button"]');
  await t.click(travelerDetailsModule.proceedToReviewButton);
}

export async function addTravelDocuments(travelers, dateFormat, nationality, option) {
  for (const traveler of travelers) {
    await scrollToElement(
      `[data-testid="travelerDetails-TravelDocumentIssueCountry-${traveler.nr}-dropdown"]`,
    );
    if (nationality !== 'Russia') {
      await dropdownSelect(
        travelerDetailsModule.nationalityDropdown(traveler.travelerNr),
        nationality,
      );
    }
    await dropdownSelect(travelerDetailsModule.documentTypeDropdown(traveler.nr), option);

    await t.typeText(travelerDetailsModule.passPortNumberInput(traveler.nr), traveler.passPortNr);

    if (travelerDetailsModule.expiryDateInput.visible) {
      const expiryDate = getExpiryDate(dateFormat);
      await t.typeText(travelerDetailsModule.expiryDateInput(traveler.nr), expiryDate);
    }
  }
}
