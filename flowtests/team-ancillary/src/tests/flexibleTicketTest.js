import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  searchAndSelectTrip,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import {
  addTravelerInformation,
  bookFlight,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import { openCartIfClosed, payWithDummyBank } from '../../../common/src/rf_pages/payment';
import {
  addFlexibleTicketAllTravelers,
  addFlexibleTicketOneTraveler,
  addNoExtraProducts,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import orderModule from '../../../common/src/rf_modules/orderModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { messageSupersaverSe } from '../../../common/src/rf_pages/order';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Flexible Ticket product verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Flexible Ticket not available for infant', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getFirstInfant()]);
  const numberOfAdults = 1;
  const numberOfInfants = 1;

  await selectProvider('IbeGDSDummy');
  await searchAndSelectTrip(
    numberOfAdults,
    0,
    numberOfInfants,
    'return trip',
    'GOT',
    'BER',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults, numberOfInfants);
  await addFlexibleTicketAllTravelers();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerModule.cartFlexTicketProductMobile.visible).ok();
    await t
      .expect(travelerModule.cartFlexTicketProductMobile.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
    await toggleCart();
  }
  if (await isDesktop()) {
    await t.expect(travelerModule.cartFlexTicketProduct.visible).ok();
    await t
      .expect(travelerModule.cartFlexTicketProduct.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
  }
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 30000 });

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(paymentModule.cartFlexTicketProductMobile.visible).ok();
    await t
      .expect(paymentModule.cartFlexTicketProductMobile.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
    await toggleCart();
  }
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartFlexTicketProduct.visible).ok();
    await t
      .expect(paymentModule.cartFlexTicketProduct.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
    await payWithDummyBank(travelers[0]);
    await t
      .expect(orderModule.infoTextOrderPage.visible)
      .ok('', { timeout: 50000 })
      .expect(orderModule.infoTextOrderPage.innerText)
      .contains(messageSupersaverSe);
  }
});

test('Different selections for flexible ticket', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
  const numberOfAdults = 2;
  const numberOfFlexibleTickets = 1;
  await selectProvider('IbeGDSDummy');
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'NEW', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await addFlexibleTicketOneTraveler(numberOfFlexibleTickets);

  // Flexible ticket for one of 2 travellers
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerModule.cartFlexTicketProductMobile.visible)
      .ok()
      .expect(travelerModule.cartFlexTicketProductMobile.innerText)
      .contains(`${numberOfFlexibleTickets} Ombokningsbar biljett`);
    await toggleCart();
  }
  if (await isDesktop()) {
    await t
      .expect(travelerModule.cartFlexTicketProduct.visible)
      .ok()
      .expect(travelerModule.cartFlexTicketProduct.innerText)
      .contains(`${numberOfFlexibleTickets} Ombokningsbar biljett`);
  }

  // Flexible ticket for both travellers
  await addFlexibleTicketAllTravelers();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerModule.cartFlexTicketProductMobile.visible)
      .ok()
      .expect(travelerModule.cartFlexTicketProductMobile.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
  }
  if (await isDesktop()) {
    await t
      .expect(travelerModule.cartFlexTicketProduct.visible)
      .ok()
      .expect(travelerModule.cartFlexTicketProduct.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
  }
});

test('Flexible ticket included in trip, added to cart', async () => {
  const numberOfAdults = 2;
  await selectProvider('IbeGDSDummy');
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'SYD', [11, 24]);
  await t.click(resultModule.bookFlightWithFlexibleTicketButton);
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerModule.cartFlexTicketProductMobile.visible)
      .ok()
      .expect(travelerModule.cartFlexTicketProductMobile.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
  }
  if (await isDesktop()) {
    await t
      .expect(travelerModule.cartFlexTicketProduct.visible)
      .ok()
      .expect(travelerModule.cartFlexTicketProduct.innerText)
      .contains(`${numberOfAdults} Ombokningsbar biljett`);
  }
});
