import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import debugModule from '../../../common/src/rf_modules/debugModule';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import {
  addCheckoutData,
  openCartIfClosed,
  payWithCreditCard,
} from '../../../common/src/rf_pages/payment';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import startModule from '../../../common/src/rf_modules/startModule';
import resultModule from '../../../common/src/rf_modules/resultModule';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);

const numberOfAdults = 2;
const bookingFeeText = 'Booking fee';
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
};

async function addCarrierToTrip(carrier) {
  await t.expect(startModule.startPageSearchForm.visible).ok();
  await t.click(debugModule.debugOptionsButton);
  await t.click(debugModule.searchCarrierDropdown);
  await t.click(debugModule.carrierOption(carrier));
  await t.click(debugModule.debugOptionsCloseButton);
}

fixture('Markup visibility for different carriers')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Markup visible for Air France (AF)', async () => {
  await addCarrierToTrip('AF');
  await selectTravelers(numberOfAdults);
  await makeSearch('one way trip', 'Stockholm', 'Paris', [11, 24]);
  // Verify on result page
  await t.expect(resultModule.resultPage.visible).ok();
  await t.click(resultModule.priceInfoButton.nth(0));

  await t.expect(resultModule.priceInformationModal.innerText).contains(bookingFeeText);

  await t.click(resultModule.priceInfoCloseButton);
  await selectTripButtonByIndex(0);

  // Verify on traveler details page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartPassengersMobile.innerText).contains(bookingFeeText);

    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartPassengers.innerText).contains(bookingFeeText);
  }

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  // Verify on payment page
  await openCartIfClosed();
  if ((await isMobile()) || (await isTablet())) {
    await t.click(paymentModule.cartToggleButtonMobile);
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartTravelerInfoMobile.innerText).contains(bookingFeeText);

    await t.click(paymentModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartPriceInfo.innerText).contains(bookingFeeText);
  }
  await payWithCreditCard();
  await addCheckoutData();
  // Verify on order page
  await waitForOrderPageToLoad();
  await t.expect(orderModule.travelerPriceInfo.innerText).contains(bookingFeeText);
});

test('Markup not visible for Spirit airlines (NK)', async () => {
  await addCarrierToTrip('NK');
  await selectTravelers(numberOfAdults);
  await makeSearch('one way trip', 'New York', 'Detroit', [11, 24]);
  // Verify on result page
  await t.expect(resultModule.resultPage.visible).ok();
  await t.click(resultModule.priceInfoButton.nth(0));

  await t.expect(resultModule.priceInformationModal.innerText).notContains(bookingFeeText);

  await t.click(resultModule.priceInfoCloseButton);
  await selectTripButtonByIndex(0);

  // Verify on traveler details page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartMarkupPriceMobile.visible).notOk({ timeout: 400 });

    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t.expect(travelerDetailsModule.cartMarkupPrice.visible).notOk({ timeout: 400 });
  }

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  // Verify on payment page
  await openCartIfClosed();
  if ((await isMobile()) || (await isTablet())) {
    await t.click(paymentModule.cartToggleButtonMobile);
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartMarkupPriceMobile.visible).notOk({ timeout: 400 });

    await t.click(paymentModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t.click(paymentModule.cartTravelerInfoButton);

    await t.expect(paymentModule.cartMarkupPrice.visible).notOk({ timeout: 400 });
  }
  await payWithCreditCard();
  await addCheckoutData();

  // Verify on order page
  await waitForOrderPageToLoad();
  await t.expect(orderModule.markupPrice.visible).notOk({ timeout: 400 });
});
