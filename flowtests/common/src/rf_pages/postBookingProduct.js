import { t } from 'testcafe';
import postbookingModule from '../rf_modules/postbookingModule';
import { scrollToElement } from '../util/clientFunction';
import { isDesktop, isMobile, isTablet } from '../util/device';
import seatMapModule from '../rf_modules/seatMapModule';
import { closeSeatMapModal, saveSeatMapSelections, selectSeatsForAllSegmentTypes } from './seatMap';
import { searchAndSelectTrip } from './start';
import { addTravelerInformation, bookFlight } from './travelerDetails';
import { payWithCreditCard } from './payment';
import { addFlexibleTicketAllTravelers, addNoExtraProducts } from './travelerDetailsProducts';

export async function openProductsInCart() {
  await t.click(postbookingModule.cartOpenProductsButton);
}

async function addSupportPackagePlatinum() {
  await scrollToElement(postbookingModule.supportPackageBasicStringSelector);
  if (await isMobile()) {
    await t.click(postbookingModule.supportPackagePlatinumMobile);
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.click(postbookingModule.supportPackagePlatinum);
  }
}

async function addSeatMap() {
  await t.click(postbookingModule.seatMapYesButton);
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
}

async function addOnlineCheckin() {
  await t.click(postbookingModule.onlineCheckinBaggageYes);
}

async function addAirHelpPlus() {
  await t.click(postbookingModule.airHelpYes);
}

async function addSms() {
  await t.click(postbookingModule.smsYesButton);
}

async function addTravelInsuranceInEu() {
  await t.click(postbookingModule.travelInsuranceInEuYes);
  await t.expect(postbookingModule.travelInsuranceModalYes.exists).ok('', { timeout: 30000 });
  await t.click(postbookingModule.travelInsuranceModalYes);
}

async function addBaggage(numberOfTravelers) {
  if (numberOfTravelers === 1) {
    await t.click(postbookingModule.checkInBaggageYesOnePassenger);
  }
  if (numberOfTravelers > 1) {
    await t.click(postbookingModule.checkinBaggageYesAllPassengers);
  }
}

export async function addAllProducts() {
  await t.expect(postbookingModule.postBookingPage.exists).ok();
  if (
    (await postbookingModule.supportPackageComponent.exists) &&
    (await postbookingModule.supportPackageComponent.visible)
  ) {
    await addSupportPackagePlatinum();
  }
  if (
    (await postbookingModule.seatMapComponent.exists) &&
    (await postbookingModule.seatMapComponent.visible)
  ) {
    await addSeatMap();
  }
  if (
    (await postbookingModule.onLineCheckinBaggageComponent.exists) &&
    (await postbookingModule.onLineCheckinBaggageComponent.visible)
  ) {
    await addOnlineCheckin();
  }
  if (
    (await postbookingModule.airHelpComponent.exists) &&
    (await postbookingModule.airHelpComponent.visible)
  ) {
    await addAirHelpPlus();
  }
  if (
    (await postbookingModule.smsComponent.exists) &&
    (await postbookingModule.smsComponent.visible)
  ) {
    await addSms();
  }
  if (
    (await postbookingModule.travelInsuranceComponent.exists) &&
    (await postbookingModule.travelInsuranceComponent.visible)
  ) {
    await addTravelInsuranceInEu();
  }
}

export async function addProducts(nrOfTravelers) {
  await t.expect(postbookingModule.postBookingPage.exists).ok();
  if (
    (await postbookingModule.seatMapComponent.exists) &&
    (await postbookingModule.seatMapComponent.visible)
  ) {
    await addSeatMap();
  }
  if (
    (await postbookingModule.checkInBaggageComponent.exists) &&
    (await postbookingModule.checkInBaggageComponent.visible)
  ) {
    await addBaggage(nrOfTravelers);
  }
  if (
    (await postbookingModule.airHelpComponent.exists) &&
    (await postbookingModule.airHelpComponent.visible)
  ) {
    await addAirHelpPlus();
  }
  if (
    (await postbookingModule.smsComponent.exists) &&
    (await postbookingModule.smsComponent.visible)
  ) {
    await addSms();
  }
  if (
    (await postbookingModule.travelInsuranceComponent.exists) &&
    (await postbookingModule.travelInsuranceComponent.visible)
  ) {
    await addTravelInsuranceInEu();
  }
}

export async function clickGoToPayment() {
  await t.click(postbookingModule.goToPayButton);
}

export async function bookFlightWithNoProducts(travelers) {
  const numberOfAdults = 2;
  const numberOfChildren = 0;
  const numberOfInfants = 0;

  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'STO',
    'AMS',
  );
  await addTravelerInformation(travelers);

  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
}

export async function createOrderFlowWithNoProductsCardPayment(travelers) {
  await bookFlightWithNoProducts(travelers);
  await payWithCreditCard();
}

async function addSupportPackagePremium() {
  await scrollToElement(postbookingModule.supportPackageBasicStringSelector);
  if (await isMobile()) {
    await t.click(postbookingModule.supportPackagePremiumMobile);
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.click(postbookingModule.supportPackagePremium);
  }
}

export async function createOrderFlowWithProducts(travelers) {
  const numberOfAdults = 2;
  const numberOfChildren = 0;
  const numberOfInfants = 0;

  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'STO',
    'LON',
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await addSupportPackagePremium();
  await addFlexibleTicketAllTravelers(numberOfAdults);
  await bookFlight();
  if (await seatMapModule.seatMapContent.exists) {
    await closeSeatMapModal();
  }
  await payWithCreditCard();
}

export async function getOrderNumber() {
  // eslint-disable-next-line no-return-await
  return await postbookingModule.orderNumber.innerText;
}

export async function loadPostBookingLogIn(url) {
  await t.navigateTo(url);
  await t.expect(postbookingModule.postBookingEmail.exists).ok();
}
