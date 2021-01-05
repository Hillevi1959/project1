/* eslint-disable no-console */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import {
  chooseTripType,
  closeHeaderUrgencyBanner,
  getTripDate,
  makeSearch,
  makeSearchMultiTrip,
  searchAndSelectTrip, selectCabinClass,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import setProps from '../../../common/src/util/props';
import {
  addTravelerInformation,
  bookFlight,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import { openCartIfClosed, payWithDummyBank } from '../../../common/src/rf_pages/payment';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import startModule from '../../../common/src/rf_modules/startModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFourthAdult,
  getFirstInfant,
  getSecondAdult,
  getThirdAdult,
} from '../../../common/src/util/travelerData';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import config from '../../testdata.json';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { getExpectedDate } from '../../../common/src/util/dateFunction';

const url = getSiteUrl('supersaver-se', config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Search, book and pay different types of trips')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });


test('Return trip, 1 adult, direct flight', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  const numberOfAdults = 1;

  const expectedDateDeparture = getExpectedDate(2, 11);
  const expectedDateReturn = getExpectedDate(2, 25);

  await t.click(startModule.directFlightBox);
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'LON', [11, 25]);
  const inputDateDeparture = await getTripDate(startModule.departureDate);
  const inputDateReturn = await getTripDate(startModule.returnDate);

  await t.expect(inputDateDeparture).eql(expectedDateDeparture);
  await t.expect(inputDateReturn).eql(expectedDateReturn);

  await selectTripButtonByIndex(0);
  await t.expect(travelerDetailsModule.travelerDetailsForm.exists).ok();
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerDetailsModule.cartTripsMobile.visible).ok();
    await toggleCart();
  } else if (await isDesktop()) {
    await t.expect(travelerDetailsModule.cartTrips.visible).ok();
  }
  await bookFlight();
  await closeSeatMapModal();

  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 30000 });
  await t.expect(paymentModule.bankLabel.visible).ok();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTripsMobile.visible).ok();
    await t.expect(paymentModule.cartTravelerInfoMobile.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContentMobile.exists).notOk();
    await toggleCart();
  } else if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTrips.visible).ok();
    await t.expect(paymentModule.cartTravelerinfo.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContent.exists).notOk();
  }

  await payWithDummyBank(travelers[0]);
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('One way trip, 1 adult, 1 child, direct flight', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getFirstChild()]);
  const numberOfAdults = 1;
  const numberOfChildern = 1;
  const expectedDateDeparture = getExpectedDate(2, 11);

  await chooseTripType('one way trip');
  await t.click(startModule.directFlightBox);
  await selectTravelers(numberOfAdults, numberOfChildern, 0);
  await makeSearch('one way trip', 'STO', 'NEW', [11]);
  const inputDateDeparture = await getTripDate(startModule.departureDate);

  await t.expect(inputDateDeparture).eql(expectedDateDeparture);

  await selectTripButtonByIndex(0);
  await t.expect(travelerDetailsModule.travelerDetailsForm.visible).ok();
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildern);
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerDetailsModule.cartTripsMobile.visible).ok();
    await toggleCart();
  } else if (await isDesktop()) {
    await t.expect(travelerDetailsModule.cartTrips.visible).ok();
  }
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 30000 });
  await t.expect(paymentModule.bankLabel.visible).ok();

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTripsMobile.visible).ok();
    await t.expect(paymentModule.cartTravelerInfoMobile.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContentMobile.exists).notOk();
    await toggleCart();
  } else if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTrips.visible).ok();
    await t.expect(paymentModule.cartTravelerinfo.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContent.exists).notOk();
  }
  await payWithDummyBank(travelers[0]);

  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 50000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('One way combination return trip, 2 adults, 1 child, 1 infant', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  const expectedDateDeparture = getExpectedDate(2, 11);
  const expectedDateReturn = getExpectedDate(2, 25);

  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  await chooseTripType('return trip');
  await makeSearch('return trip', 'Stockholm Bromma', 'TOJ', [11, 25]);

  const inputDateDeparture = await getTripDate(startModule.departureDate);
  const inputDateReturn = await getTripDate(startModule.returnDate);

  await t.expect(inputDateDeparture).eql(expectedDateDeparture);
  await t.expect(inputDateReturn).eql(expectedDateReturn);
  await selectTripButtonByIndex(0);

  await t.expect(travelerDetailsModule.travelerDetailsForm.visible).ok();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerDetailsModule.cartTripsMobile.visible).ok();
    await toggleCart();
  } else if (await isDesktop()) {
    await t.expect(travelerDetailsModule.cartTrips.visible).ok();
  }
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 30000 });
  await t.expect(paymentModule.bankLabel.visible).ok();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTripsMobile.visible).ok();
    await t.expect(paymentModule.cartTravelerInfoMobile.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContentMobile.exists).notOk();
    await toggleCart();
  } else if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTrips.visible).ok();
    await t.expect(paymentModule.cartTravelerinfo.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContent.exists).notOk();
  }
  await payWithDummyBank(travelers[0]);

  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 50000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('Multi destination, 4 adults', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getThirdAdult(),
    getFourthAdult(),
  ]);
  const numberOfAdults = 4;
  const multiStopProps = {
    'IbeClient.MultiStop.Enabled': true,
  };
  const expectedDateTrip1 = getExpectedDate(1, 1);
  const expectedDateTrip2 = getExpectedDate(1, 10);

  await setProps(multiStopProps);
  await chooseTripType('multi trip');
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearchMultiTrip(['STO', 'CPH'], ['BER', 'ROM'], [1, 10]);
  const inputDateTrip1 = await getTripDate(startModule.setMultiTripDate(0));
  const inputDateTrip2 = await getTripDate(startModule.setMultiTripDate(1));

  await t.expect(inputDateTrip1).eql(expectedDateTrip1);
  await t.expect(inputDateTrip2).eql(expectedDateTrip2);

  await selectTripButtonByIndex(0);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  if (await isMobile()) {
    await toggleCart();
    await t.expect(travelerDetailsModule.cartTripMobile().nth(0).innerText).contains('Stockholm');
    await t.expect(travelerDetailsModule.cartTripMobile().nth(1).innerText).contains('Köpenhamn');
    await t.expect(travelerDetailsModule.cartTripMobile().nth(2).innerText).contains('Berlin');
    await t.expect(travelerDetailsModule.cartTripMobile().nth(3).innerText).contains('Rom');
    await toggleCart();
  } else if (await isDesktop()) {
    await t.expect(travelerDetailsModule.cartTrip.nth(0).innerText).contains('Stockholm');
    await t.expect(travelerDetailsModule.cartTrip.nth(0).innerText).contains('Köpenhamn');
    await t.expect(travelerDetailsModule.cartTrip.nth(1).innerText).contains('Berlin');
    await t.expect(travelerDetailsModule.cartTrip.nth(1).innerText).contains('Rom');
  }

  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 30000 });
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTripMobile.nth(0).innerText).contains('Stockholm');
    await t.expect(paymentModule.cartTripMobile.nth(1).innerText).contains('Köpenhamn');
    await t.expect(paymentModule.cartTripMobile.nth(2).innerText).contains('Berlin');
    await t.expect(paymentModule.cartTripMobile.nth(3).innerText).contains('Rom');
    await toggleCart();
  } else if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartTrip.nth(0).innerText).contains('Stockholm');
    await t.expect(paymentModule.cartTrip.nth(1).innerText).contains('Köpenhamn');
    await t.expect(paymentModule.cartTrip.nth(2).innerText).contains('Berlin');
    await t.expect(paymentModule.cartTrip.nth(3).innerText).contains('Rom');
  }
  await payWithDummyBank(travelers[0]);

  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 30000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
  await t.expect(orderModule.orderInfoTrip.nth(0).innerText).contains('Stockholm');
  await t.expect(orderModule.orderInfoTrip.nth(0).innerText).contains('Köpenhamn');
  await t.expect(orderModule.orderInfoTrip.nth(1).innerText).contains('Berlin');
  await t.expect(orderModule.orderInfoTrip.nth(1).innerText).contains('Rom');
});
