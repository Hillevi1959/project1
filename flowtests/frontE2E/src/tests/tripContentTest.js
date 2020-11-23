/* eslint-disable no-await-in-loop */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectCabinClass,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import setProps from '../../../common/src/util/props';
import {
  addTravelerInformation,
  bookFlight,
  getTotalPriceForTrip,
  toggleCart,
  toggleTripDetailsTravelerDetails,
} from '../../../common/src/rf_pages/travelerDetails';
import {
  selectProvider,
  setIBEDummyPaymentBankOn,
  setOwcOnly,
} from '../../../common/src/util/debugOptions';
import {
  openCartIfClosed,
  payWithDummyBank,
  travelerNamesAsString,
} from '../../../common/src/rf_pages/payment';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import config from '../../testdata.json';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { filterSasLufthansa, selectTripNumber } from '../../../common/src/rf_pages/result';
import resultModule from '../../../common/src/rf_modules/resultModule';

const url = getSiteUrl('supersaver-se', config.host);
const nrBounds = 2;
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Result.PaymentMethod.DiscountInformation.Enable': true,
  'IbeClient.Result.ShowPrice.Type': 'TOTAL',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Verify trip content and price on different types of trips')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await setProps(props);
    await selectProvider('IbeGDSDummy');
    await setOwcOnly();
    await closeHeaderUrgencyBanner();
  });

test('Verify trip details and price for one way combination with 2 adults, 1 child, 1 infant', async () => {
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  const numberOfTravelers = 4;
  const origin = 'Stockholm';
  const destination = 'Madrid';
  const nrSegments = 2;
  const originFlightNr = 'SK900';
  const destinationFlightNr = 'SK900';
  const { count } = paymentModule.travelerDetailsName;
  const travelersName = travelerNamesAsString(travelers);
  const travelersAge = 'vuxen barn spädbarn';

  await selectCabinClass('PREMIUM_ECONOMY');
  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  await makeSearch('return trip', 'NYO', 'TOJ', 10);
  await filterSasLufthansa();
  await t.click(resultModule.toggleTrip(0));

  await t.expect(resultModule.owcInformation.visible).ok();
  await t.expect(resultModule.discountInformation.visible).ok();

  await selectTripNumber(0);
  const tripPrice = await getTotalPriceForTrip();
  await toggleTripDetailsTravelerDetails();

  // Verify trip content in flight information on traveler-details page
  await t.expect(travelerDetailsModule.cabinClassInfo.nth(0).innerText).contains('Premium');
  await t.expect(travelerDetailsModule.cabinClassInfo.nth(1).innerText).contains('Premium');
  await t.expect(travelerDetailsModule.tripBound.count).eql(nrBounds);
  await t.expect(travelerDetailsModule.tripSegment.count).eql(nrSegments);
  await t
    .expect(travelerDetailsModule.tripSegmentFlightNr.nth(0).innerText)
    .contains(originFlightNr);
  await t
    .expect(travelerDetailsModule.tripSegmentFlightNr.nth(1).innerText)
    .contains(originFlightNr);
  await t.expect(travelerDetailsModule.tripSegFirstOrigin.innerText).contains(origin);
  await t.expect(travelerDetailsModule.tripSegFirstDestination.innerText).contains(destination);
  await t.expect(travelerDetailsModule.tripSegSecondOrigin.innerText).contains(destination);
  await t.expect(travelerDetailsModule.tripSegSecondDestination.innerText).contains(origin);
  await t.expect(travelerDetailsModule.owcInformation.visible).ok();

  await toggleTripDetailsTravelerDetails();
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfTravelers - numberOfInfants);

  // Verify trip content in cart on traveler-details page
  if ((await isMobile()) || (await isTablet())) {
    await t.expect(travelerDetailsModule.cartDiscountInformation.nth(1).visible).ok();
    await toggleCart();
    await t.click(travelerDetailsModule.cartTravelerToggleButtonMobile);

    await t.expect(travelerDetailsModule.cartTripPriceMobile.innerText).contains(tripPrice);
    await t.expect(travelerDetailsModule.cartFlightMobile.nth(0).innerText).contains(origin);
    await t.expect(travelerDetailsModule.cartFlightMobile.nth(1).innerText).contains(destination);
    await t.expect(travelerDetailsModule.cartPassengersMobile.nth(0).innerText).contains('2 vuxna');
    await t.expect(travelerDetailsModule.cartPassengersMobile.nth(1).innerText).contains('1 barn');
    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(2).innerText)
      .contains('1 spädbarn');
    await t.expect(travelerDetailsModule.cartExtraProductsContentMobile.exists).notOk();

    await toggleCart();
  } else if (await isDesktop()) {
    await t.expect(travelerDetailsModule.cartDiscountInformation.visible).ok();
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartTripPrice.innerText).contains(tripPrice);
    await t.expect(travelerDetailsModule.cartFlight.nth(0).innerText).contains(origin);
    await t.expect(travelerDetailsModule.cartFlight.nth(1).innerText).contains(destination);
    await t.expect(travelerDetailsModule.cartPassengers.nth(0).innerText).contains('2 vuxna');
    await t.expect(travelerDetailsModule.cartPassengers.nth(1).innerText).contains('1 barn');
    await t.expect(travelerDetailsModule.cartPassengers.nth(2).innerText).contains('1 spädbarn');
    await t.expect(travelerDetailsModule.cartExtraProductsContent.exists).notOk();
  }
  await bookFlight();
  await closeSeatMapModal();

  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 30000 });

  // Verify trip content in cart on payment page
  await t.expect(paymentModule.cartDiscountInformation.visible).ok();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();

    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTripsMobile.visible).ok();
    await t.expect(paymentModule.cartTravelerInfoMobile.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContentMobile.exists).notOk();
    await t.expect(paymentModule.cartPriceMobile.innerText).contains(tripPrice);
    await t.expect(paymentModule.cartFlightContentMobile.visible).ok();
    await t.expect(paymentModule.cartFlightContentMobile.nth(0).innerText).contains(origin);
    await t.expect(paymentModule.cartFlightContentMobile.nth(1).innerText).contains(destination);

    await toggleCart();
  } else if (await isDesktop()) {
    await openCartIfClosed();
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTrips.visible).ok();
    await t.expect(paymentModule.cartTravelerinfo.visible).ok();
    await t.expect(paymentModule.cartExtraProductsContent.exists).notOk();
    await t.expect(paymentModule.cartPrice.innerText).contains(tripPrice);
    await t.expect(paymentModule.cartFlightContent.visible).ok();
    await t.expect(paymentModule.cartFlightContent.innerText).contains(origin);
    await t.expect(paymentModule.cartFlightContent.innerText).contains(destination);
  }

  // Verify trip content in flight information on payment page
  await t.click(paymentModule.tripDetailsToggleButton);

  await t.expect(paymentModule.tripBound.count).eql(nrBounds);
  await t.expect(paymentModule.tripSegment.count).eql(nrSegments);
  await t.expect(paymentModule.tripSegmentFlightNr.nth(0).innerText).contains(originFlightNr);
  await t.expect(paymentModule.tripSegmentFlightNr.nth(1).innerText).contains(destinationFlightNr);
  await t.expect(paymentModule.cabinClassInfo.nth(0).innerText).contains('Premium');
  await t.expect(paymentModule.cabinClassInfo.nth(1).innerText).contains('Premium');
  await t.expect(paymentModule.tripSegFirstOrigin.innerText).contains(origin);
  await t.expect(paymentModule.tripSegFirstDestination.innerText).contains(destination);
  await t.expect(paymentModule.tripSegSecondOrigin.innerText).contains(destination);
  await t.expect(paymentModule.tripSegSecondDestination.innerText).contains(origin);
  await t.expect(paymentModule.owcInformation.visible).ok();

  await t.click(paymentModule.tripDetailsToggleButton);
  await t.click(paymentModule.travelerDetailsToggleButton);

  await t.expect(paymentModule.travelerDetailsEmail.innerText).contains(travelers[0].email);
  await t.expect(paymentModule.travelerDetailsPhone.innerText).contains(travelers[0].phone);
  for (let i = 0; i < (await count); i += 1) {
    await t
      .expect(travelersName)
      .contains(await paymentModule.travelerDetailsName.nth(i).innerText);
    await t.expect(travelersAge).contains(await paymentModule.travelerDetailsAge.nth(i).innerText);
  }

  await t.click(paymentModule.travelerDetailsToggleButton);
  await payWithDummyBank(travelers[0]);

  // Verify trip content on order page
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
  await t.expect(orderModule.tripBound.count).eql(nrBounds);
  await t.expect(orderModule.tripSegment.count).eql(nrSegments);
  await t.expect(orderModule.cabinClassInfo.nth(0).innerText).contains('Premium');
  await t.expect(orderModule.cabinClassInfo.nth(1).innerText).contains('Premium');
  await t.expect(orderModule.tripSegFirstOrigin.innerText).contains(origin);
  await t.expect(orderModule.tripSegFirstDestination.innerText).contains(destination);
  await t.expect(orderModule.tripSegSecondOrigin.innerText).contains(destination);
  await t.expect(orderModule.tripSegSecondDestination.innerText).contains(origin);

  await t.click(orderModule.flightInfoButton);

  await t.expect(orderModule.owcInformation.visible).ok();
});
