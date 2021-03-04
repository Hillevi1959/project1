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
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture
  .skip('Ancillary Bundle Overlay Verification')
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
    await t.expect(travelerDetailsModule.cartAncillaryBundleMobile.visible).ok();
    await t
      .expect(travelerDetailsModule.cartAncillaryBundleMobile.innerText)
      .contains('Ombokningsbar biljett')
      .expect(travelerDetailsModule.cartAncillaryBundleMobile.innerText)
      .contains('Avbokningsgaranti');
    await toggleCart();
  }

  if (await isDesktop()) {
    await t.expect(travelerDetailsModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
    await t.expect(travelerDetailsModule.cartAncillaryBundle.visible).ok();
    await t
      .expect(travelerDetailsModule.cartAncillaryBundle.innerText)
      .contains('Flex Ticket Bundle:Flex +')
      .expect(travelerDetailsModule.cartAncillaryBundle.innerText)
      .contains('Ombokningsbar biljett')
      .expect(travelerDetailsModule.cartAncillaryBundle.innerText)
      .contains('Avbokningsgaranti');
  }
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(paymentModule.cartAncillaryBundleMobile.visible).ok();
    await t
      .expect(paymentModule.cartAncillaryBundleMobile.innerText)
      .contains('Ombokningsbar biljett')
      .expect(paymentModule.cartAncillaryBundleMobile.innerText)
      .contains('Avbokningsgaranti');
    await toggleCart();
  }
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartAncillaryBundle.visible).ok();
    await t
      .expect(paymentModule.cartAncillaryBundle.innerText)
      .contains('Ombokningsbar biljett')
      .expect(paymentModule.cartAncillaryBundle.innerText)
      .contains('Avbokningsgaranti');
  }

  await payWithDummyBank();
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});
