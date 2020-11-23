/* eslint-disable no-await-in-loop */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getThirdAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation } from '../../../common/src/rf_pages/travelerDetails';
import {
  addBaggageForTravelers,
  addNoExtraProducts,
  addSeatMap,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import setProps from '../../../common/src/util/props';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import { openCartIfClosed } from '../../../common/src/rf_pages/payment';

const url = getSiteUrl('supersaver-se', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getThirdAdult()]);
const props = {
  'IbeClient.TravelerDetails.Modal': 'NONE',
  'Baggage.ShowPriceInformation.Carriers':
    'KL, AF, A5, MP, HV, JN, WA, TO, DL, CY, IB, I2, BA, EI, LV, VY, FR, F9, LH, SK',
  'Seating.ShowPriceInformation.Carriers':
    'KL, AF, A5, MP, HV, JN, WA, TO, DL, CY, IB, I2, BA, EI, LV, VY, FR, F9, LH, SK',
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
};
const textBookingFee = 'Bokningsavgift'; // Booking fee
const textProviderCost = 'Leverantörskostnad'; // Provider Cost
const numberOfAdults = 2;

fixture('Price breakdown in cart for baggage and seating')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Price breakdown folded at start on TD-page and payment page', async () => {
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'Stockholm', 'London');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await addBaggageForTravelers(travelers);
  await addSeatMap();

  // Verify price breakdown on TD-page
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
    await t
      .expect(travelerDetailsModule.cartCheckInBaggageProductMobile.innerText)
      .notContains(textBookingFee)
      .expect(travelerDetailsModule.cartCheckInBaggageProductMobile.innerText)
      .notContains(textProviderCost);

    await t.click(travelerDetailsModule.cartCheckInBaggageProductMobile);

    await t
      .expect(travelerDetailsModule.cartCheckInBaggageProductMobile.innerText)
      .contains(textBookingFee)
      .expect(travelerDetailsModule.cartCheckInBaggageProductMobile.innerText)
      .contains(textProviderCost);
    await t
      .expect(travelerDetailsModule.cartSeatMapProductMobile.innerText)
      .notContains(textBookingFee)
      .expect(travelerDetailsModule.cartSeatMapProductMobile.innerText)
      .notContains(textProviderCost);

    await t.click(travelerDetailsModule.cartSeatMapProductMobile);

    await t
      .expect(travelerDetailsModule.cartSeatMapProductMobile.innerText)
      .contains(textBookingFee)
      .expect(travelerDetailsModule.cartSeatMapProductMobile.innerText)
      .contains(textProviderCost);
    await t.click(travelerDetailsModule.cartToggleButtonMobile);
  }
  if (await isDesktop()) {
    await t
      .expect(travelerDetailsModule.cartCheckInBaggageProduct.innerText)
      .notContains(textBookingFee)
      .expect(travelerDetailsModule.cartCheckInBaggageProduct.innerText)
      .notContains(textProviderCost);

    await t.click(travelerDetailsModule.cartCheckInBaggageProduct);

    await t
      .expect(travelerDetailsModule.cartCheckInBaggageProduct.innerText)
      .contains(textBookingFee)
      .expect(travelerDetailsModule.cartCheckInBaggageProduct.innerText)
      .contains(textProviderCost);
    await t
      .expect(travelerDetailsModule.cartSeatMapProduct.innerText)
      .notContains(textBookingFee)
      .expect(travelerDetailsModule.cartSeatMapProduct.innerText)
      .notContains(textProviderCost);

    await t.click(travelerDetailsModule.cartSeatMapProduct);

    await t
      .expect(travelerDetailsModule.cartSeatMapProduct.innerText)
      .contains(textBookingFee)
      .expect(travelerDetailsModule.cartSeatMapProduct.innerText)
      .contains(textProviderCost);
  }

  await t.click(travelerDetailsModule.bookButton);

  // Verify Price breakdown on payment page
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartCheckInBaggageProduct.visible).ok('', { timeout: 40000 });
    await t
      .expect(paymentModule.cartCheckInBaggageProduct.innerText)
      .notContains(textBookingFee)
      .expect(paymentModule.cartCheckInBaggageProduct.innerText)
      .notContains(textProviderCost);

    await t.click(paymentModule.cartCheckInBaggageProduct);

    await t
      .expect(paymentModule.cartCheckInBaggageProduct.innerText)
      .contains(textBookingFee)
      .expect(paymentModule.cartCheckInBaggageProduct.innerText)
      .contains(textProviderCost);
    await t
      .expect(paymentModule.cartSeatMapProduct.innerText)
      .notContains(textBookingFee)
      .expect(paymentModule.cartSeatMapProduct.innerText)
      .notContains(textProviderCost);

    await t.click(paymentModule.cartSeatMapProduct);

    await t
      .expect(paymentModule.cartSeatMapProduct.innerText)
      .contains(textBookingFee)
      .expect(paymentModule.cartSeatMapProduct.innerText)
      .contains(textProviderCost);
  } else if ((await isMobile()) || (await isTablet())) {
    await t
      .expect(paymentModule.cartCheckInBaggageProductMobile.innerText)
      .notContains(textBookingFee)
      .expect(paymentModule.cartCheckInBaggageProductMobile.innerText)
      .notContains(textProviderCost);
    await t
      .expect(paymentModule.cartSeatMapProductMobile().innerText)
      .notContains(textBookingFee)
      .expect(paymentModule.cartSeatMapProductMobile().innerText)
      .notContains(textProviderCost);

    await t.click(paymentModule.cartToggleButtonMobile);
    await t.click(paymentModule.cartCheckInBaggageProductMobile);

    await t
      .expect(paymentModule.cartCheckInBaggageProductMobile.innerText)
      .contains(textBookingFee)
      .expect(paymentModule.cartCheckInBaggageProductMobile.innerText)
      .contains(textProviderCost);

    await t.click(paymentModule.cartSeatMapProductMobile());

    await t
      .expect(paymentModule.cartSeatMapProductMobile().innerText)
      .contains(textBookingFee)
      .expect(paymentModule.cartSeatMapProductMobile().innerText)
      .contains(textProviderCost);
  }
});
