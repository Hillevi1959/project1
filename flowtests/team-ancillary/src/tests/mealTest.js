// eslint-disable-next-line filenames/match-regex
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import {
  addTravelerInformation,
  bookFlight,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import { openCartIfClosed, payWithDummyBank } from '../../../common/src/rf_pages/payment';
import { addMeal, addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);

const propsOverlay = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Meal Test')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await setProps(propsOverlay);
    await closeHeaderUrgencyBanner();
    await selectProvider('IbeGDSDummy');
  });

test('Book and pay for a trip with added meals', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
  const numberOfAdults = 2;
  await selectTravelers(numberOfAdults, 0, 0);

  await makeSearch('return trip', 'STO', 'LON', [12, 25]);
  await selectTripButtonByIndex(0);

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await addMeal(numberOfAdults);

  await bookFlight();
  await closeSeatMapModal();

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(paymentModule.cartMealProductMobile.visible).ok();
    await toggleCart();
  }

  if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartMealProduct.visible).ok();
  }

  await payWithDummyBank();
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
  await t.expect(orderModule.cartMealProduct.visible).ok();
});
