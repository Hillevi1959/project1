import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import {
  closeHeaderUrgencyBanner,
  getTripDate,
  searchAndSelectTrip,
} from '../../../common/src/rf_pages/start';
import { getTripWithCountryAndBrand } from '../../../common/src/util/metaTrips';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import {
  addSearchDataResultPage,
  selectTripButtonByIndex,
} from '../../../common/src/rf_pages/result';
import { getExpectedDate } from '../../../common/src/util/dateFunction';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  addCheckoutData,
  openCartIfClosed,
  payWithCreditCard,
} from '../../../common/src/rf_pages/payment';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';

// const url = getSiteUrl('gotogate-uk', config.host);
// const url = getSiteUrl('SE-meta', config.host);
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);

const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
const adultTextOneAdult = '1 adult';
const adultTextTwoAdults = '2 adults';
const childText = '1 child';
const infantText = '1 infant';

const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'TD.BackToSearchBtn.Enabled': true,
  'IbeClient.MetaEntry.WithResultsSupport.Enabled': false,
};

fixture('Edit search from traveler details page');

test.before(async () => {
  const url = await getSiteUrl('gotogate-uk', config.host);
  await t.navigateTo(url);
  await enableDebug();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await acceptCookies();
  await closeHeaderUrgencyBanner();
})('Edit search when coming from result page', async () => {
  const airport1 = 'New York';
  const airport2 = 'Barcelona';
  const airport3 = 'Madrid';
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', airport1, airport2, 'ECONOMY', [
    11,
    24,
  ]);

  await t.click(travelerDetailsModule.editSearchButton);
  // Verify trip from TD page on result page
  await t.expect(resultModule.resultPage.visible).ok();

  await t.expect(resultModule.tripInfoAirport.nth(0).innerText).contains(airport1);
  await t.expect(resultModule.tripInfoAirport.nth(1).innerText).contains(airport2);
  await t.expect(resultModule.tripInfoAirport.nth(2).innerText).contains(airport2);
  await t.expect(resultModule.tripInfoAirport.nth(3).innerText).contains(airport1);

  // Change trip on result page
  await addSearchDataResultPage(
    numberOfAdults,
    airport1,
    airport3,
    numberOfChildren,
    numberOfInfants,
  );
  await t.click(resultModule.searchFlight);
  await t.click(resultModule.searchFormButton);
  await selectTripButtonByIndex(0);

  // Verify changed trip on TD page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartTripsMobile.innerText).contains(airport1);
    await t.expect(travelerDetailsModule.cartTripsMobile.innerText).contains(airport3);
    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(0).innerText)
      .contains(adultTextTwoAdults);
    await t.expect(travelerDetailsModule.cartPassengersMobile.nth(1).innerText).contains(childText);
    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(2).innerText)
      .contains(infantText);
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(travelerDetailsModule.cartTravelerToggleButton);
    await t.expect(travelerDetailsModule.cartTrips.innerText).contains(airport1);
    await t.expect(travelerDetailsModule.cartTrips.innerText).contains(airport3);
    await t
      .expect(travelerDetailsModule.cartPassengers.nth(0).innerText)
      .contains(adultTextTwoAdults);
    await t.expect(travelerDetailsModule.cartPassengers.nth(1).innerText).contains(childText);
    await t.expect(travelerDetailsModule.cartPassengers.nth(2).innerText).contains(infantText);
  }

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();

  // Verify payment page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(paymentModule.cartToggleButtonMobile);
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTripsMobile.innerText).contains(airport1);
    await t.expect(paymentModule.cartTripsMobile.innerText).contains(airport3);
    await t
      .expect(paymentModule.cartTravelerInfoMobile.nth(0).innerText)
      .contains(adultTextTwoAdults);
    await t.expect(paymentModule.cartTravelerInfoMobile.nth(1).innerText).contains(childText);
    await t.expect(paymentModule.cartTravelerInfoMobile.nth(2).innerText).contains(infantText);

    await t.click(paymentModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTrips.innerText).contains(airport1);
    await t.expect(paymentModule.cartTrips.innerText).contains(airport3);
    await t.expect(paymentModule.cartPriceInfo.nth(0).innerText).contains(adultTextTwoAdults);
    await t.expect(paymentModule.cartPriceInfo.nth(1).innerText).contains(childText);
    await t.expect(paymentModule.cartPriceInfo.nth(2).innerText).contains(infantText);
  }

  await payWithCreditCard();
  await addCheckoutData();

  // Verify order page
  await waitForOrderPageToLoad();

  await t.expect(orderModule.orderInfoTrip.innerText).contains(airport1);
  await t.expect(orderModule.orderInfoTrip.innerText).contains(airport3);
  await t.expect(orderModule.travelerPriceInfo.nth(0).innerText).contains(adultTextTwoAdults);
  await t.expect(orderModule.travelerPriceInfo.nth(1).innerText).contains(childText);
  await t.expect(orderModule.travelerPriceInfo.nth(2).innerText).contains(infantText);
});

test.before(async () => {
  const url = await getSiteUrl('gotogate-uk-meta', config.host);
  const tripUrl = await getTripWithCountryAndBrand(url, 'gotogate', 'GB');
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await t.navigateTo(tripUrl);
  await closeHeaderUrgencyBanner();
})('Edit search when coming from meta page', async () => {
  const airport1 = 'Stockholm';
  const airport2 = 'London';
  const airport3 = 'Madrid';
  const expectedDateDeparture = getExpectedDate(4, 11);
  const expectedDateReturn = getExpectedDate(4, 24);

  // Verify trip from meta on TD page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartTripsMobile.innerText).contains(airport1);
    await t.expect(travelerDetailsModule.cartTripsMobile.innerText).contains(airport2);
    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(0).innerText)
      .contains(adultTextOneAdult);

    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartTrips.innerText).contains(airport1);
    await t.expect(travelerDetailsModule.cartTrips.innerText).contains(airport2);
    await t
      .expect(travelerDetailsModule.cartPassengers.nth(0).innerText)
      .contains(adultTextOneAdult);
  }

  await t.click(travelerDetailsModule.editSearchButton);
  // Verify trip from meta on result page
  await t.expect(resultModule.resultPage.visible).ok();

  await t.expect(resultModule.tripInfoAirport.nth(0).innerText).contains(airport1);
  await t.expect(resultModule.tripInfoAirport.nth(1).innerText).contains(airport2);
  await t.expect(resultModule.tripInfoAirport.nth(2).innerText).contains(airport2);
  await t.expect(resultModule.tripInfoAirport.nth(3).innerText).contains(airport1);

  // Change trip on result page
  await addSearchDataResultPage(
    numberOfAdults,
    airport1,
    airport3,
    numberOfChildren,
    numberOfInfants,
  );
  const inputDateDeparture = await getTripDate(resultModule.departureDate);
  const inputDateReturn = await getTripDate(resultModule.returnDate);

  await t.click(resultModule.searchFlight);
  await t.click(resultModule.searchFormButton);

  await t.expect(inputDateDeparture).eql(expectedDateDeparture);
  await t.expect(inputDateReturn).eql(expectedDateReturn);

  await selectTripButtonByIndex(0);

  // Verify changed trip on TD page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartTripsMobile.innerText).contains(airport1);
    await t.expect(travelerDetailsModule.cartTripsMobile.innerText).contains(airport3);
    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(0).innerText)
      .contains(adultTextTwoAdults);
    await t.expect(travelerDetailsModule.cartPassengersMobile.nth(1).innerText).contains(childText);
    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(2).innerText)
      .contains(infantText);
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(travelerDetailsModule.cartTravelerToggleButton);
    await t.expect(travelerDetailsModule.cartTrips.innerText).contains(airport1);
    await t.expect(travelerDetailsModule.cartTrips.innerText).contains(airport3);
    await t
      .expect(travelerDetailsModule.cartPassengers.nth(0).innerText)
      .contains(adultTextTwoAdults);
    await t.expect(travelerDetailsModule.cartPassengers.nth(1).innerText).contains(childText);
    await t.expect(travelerDetailsModule.cartPassengers.nth(2).innerText).contains(infantText);
  }

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();

  // Verify payment page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(paymentModule.cartToggleButtonMobile);
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTripsMobile.innerText).contains(airport1);
    await t.expect(paymentModule.cartTripsMobile.innerText).contains(airport3);
    await t
      .expect(paymentModule.cartTravelerInfoMobile.nth(0).innerText)
      .contains(adultTextTwoAdults);
    await t.expect(paymentModule.cartTravelerInfoMobile.nth(1).innerText).contains(childText);
    await t.expect(paymentModule.cartTravelerInfoMobile.nth(2).innerText).contains(infantText);

    await t.click(paymentModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTrips.innerText).contains(airport1);
    await t.expect(paymentModule.cartTrips.innerText).contains(airport3);
    await t.expect(paymentModule.cartPriceInfo.nth(0).innerText).contains(adultTextTwoAdults);
    await t.expect(paymentModule.cartPriceInfo.nth(1).innerText).contains(childText);
    await t.expect(paymentModule.cartPriceInfo.nth(2).innerText).contains(infantText);
  }

  await payWithCreditCard();
  await addCheckoutData();

  // Verify order page
  await waitForOrderPageToLoad();

  await t.expect(orderModule.orderInfoTrip.innerText).contains(airport1);
  await t.expect(orderModule.orderInfoTrip.innerText).contains(airport3);
  await t.expect(orderModule.travelerPriceInfo.nth(0).innerText).contains(adultTextTwoAdults);
  await t.expect(orderModule.travelerPriceInfo.nth(1).innerText).contains(childText);
  await t.expect(orderModule.travelerPriceInfo.nth(2).innerText).contains(infantText);
});
