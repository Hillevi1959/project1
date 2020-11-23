import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import {
  addTravelerInformation,
  bookFlight,
  closeCart,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import { openCartIfClosed, payWithDummyBank } from '../../../common/src/rf_pages/payment';
import { messageSupersaverSe } from '../../../common/src/rf_pages/order';
import {
  selectSeatsAndVerifyNotIncludeInfants,
  selectSeatsAndSeatingPreference,
  selectSeatsForAllSegmentTypes,
  saveSeatMapSelections,
} from '../../../common/src/rf_pages/seatMap';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstInfant,
} from '../../../common/src/util/travelerData';
import { isMobile, isTablet } from '../../../common/src/util/device';
import orderModule from '../../../common/src/rf_modules/orderModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Seat map product verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setProps(props);
    await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await closeHeaderUrgencyBanner();
  });

test('SeatMap is visible after book is pressed, seats selected and verfied in cart', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  const numberOfTravelers = 1;
  const numberOfSeatsBooked = 4;

  await searchAndSelectTrip(numberOfTravelers, 0, 0, 'return trip', 'GOT', 'PAR');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfTravelers);
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
  }

  await t.expect(travelerDetailsModule.cartExtraProductsContent.exists).notOk();

  if ((await isMobile()) || (await isTablet())) {
    await closeCart();
  }

  await t.expect(travelerDetailsModule.bookButton.hasAttribute('disabled')).notOk();
  await t.click(travelerDetailsModule.bookButton);
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();

  await t.expect(paymentModule.paymentContainer.visible).ok('', { timeout: 50000 });
  await openCartIfClosed();

  await t.expect(paymentModule.cartSeatMapProduct.visible).ok('', { timeout: 30000 });
  await t
    .expect(paymentModule.cartSeatMapProduct.innerText)
    .contains(`${numberOfSeatsBooked} Platsreservation`);
});

test('SeatMap is visible before book, not selectable for infant and verfied in cart', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getFirstInfant()]);
  const modalDisabled = {
    'IbeClient.TravelerDetails.Modal': 'NONE',
  };
  const numberOfAdults = 1;
  const numberOfInfants = 1;
  const numberOfSegments = 4;

  await setProps(modalDisabled);

  await searchAndSelectTrip(numberOfAdults, 0, numberOfInfants, 'return trip', 'GOT', 'PAR');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await selectSeatsAndVerifyNotIncludeInfants(numberOfSegments);
  await bookFlight();

  await t.expect(paymentModule.bankLabel.visible).ok();
  await openCartIfClosed();
  await t.expect(paymentModule.cartSeatMapProduct.visible).ok();
  await t
    .expect(paymentModule.cartSeatMapProduct.innerText)
    .contains(`${numberOfSegments} Platsreservation`);

  await payWithDummyBank(travelers[0]);

  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 50000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('SeatMap book seating light and beside', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getFirstInfant()]);
  const seatingComboProps = {
    'Product.SeatMap.SeatingCombo.Enable': true,
    'IbeClient.TravelerDetails.Modal': 'NONE',
  };
  const numberOfAdults = 1;
  const numberOfInfants = 1;
  const numberOfSegments = 4;

  await setProps(seatingComboProps);

  await searchAndSelectTrip(numberOfAdults, 0, numberOfInfants, 'return trip', 'GOT', 'BKK');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await selectSeatsAndSeatingPreference();
  await bookFlight();

  await t.expect(paymentModule.bankLabel.visible).ok();
  await openCartIfClosed();
  await t.expect(paymentModule.cartSeatMapProduct.visible).ok();
  await t
    .expect(paymentModule.cartSeatMapProduct.innerText)
    .contains(`${numberOfSegments} Platsreservation`);

  await payWithDummyBank(travelers[0]);

  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 50000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});
