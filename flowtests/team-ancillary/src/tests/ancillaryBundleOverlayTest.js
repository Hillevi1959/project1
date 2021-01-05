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
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);

const propsOverlay = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'OVERLAY',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Ancillary Bundle Overlay Verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await setProps(propsOverlay);
    await closeHeaderUrgencyBanner();
  });

test('Book and pay for a trip with bundled products', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
  const numberOfAdults = 2;
  await selectProvider('IbeGDSDummy');
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'LON', [11, 24]);
  await selectTripButtonByIndex(0);

  await t.expect(resultModule.productBundleOption3.visible).ok();
  await t
    .click(resultModule.productBundleOption3Button)
    .click(resultModule.productBundleConfirmationButton);

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerDetailsModule.cartFlexTicketProductMobile.visible)
      .ok()
      .expect(travelerDetailsModule.cartCancellationInsideEuProductMobile.visible)
      .ok();
    await toggleCart();
  }

  if (await isDesktop()) {
    await t
      .expect(travelerDetailsModule.cartFlexTicketProduct.visible)
      .ok()
      .expect(travelerDetailsModule.cartCancellationInsideEuProduct.visible)
      .ok();
  }
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(paymentModule.cartFlexTicketProductMobile.visible).ok();
    await t.expect(paymentModule.cartCancellationInsideEuProductMobile.visible).ok();
    await t
      .expect(paymentModule.cartFlexTicketProductMobile.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`)
      .expect(paymentModule.cartCancellationInsideEuProductMobile.innerText)
      .contains(`${numberOfAdults} Avbokningsgaranti`);
    await toggleCart();
  }
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartFlexTicketProduct.visible).ok();
    await t.expect(paymentModule.cartCancellationInsideEuProduct.visible).ok();
    await t
      .expect(paymentModule.cartFlexTicketProduct.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`)
      .expect(paymentModule.cartCancellationInsideEuProduct.innerText)
      .contains(`${numberOfAdults} Avbokningsgaranti`);
  }

  await payWithDummyBank(travelers[0]);
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});
