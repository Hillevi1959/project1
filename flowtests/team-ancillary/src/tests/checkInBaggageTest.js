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
  getNumberOfBounds,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import {
  addBaggage,
  addBaggageForTravelers,
  addNoBaggage,
  addNoExtraProducts,
  getBaggageCartPrice,
  getBaggagePrice,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import {
  getBaggagePricePayment,
  openCartIfClosed,
  payWithDummyBank,
} from '../../../common/src/rf_pages/payment';
import orderModule from '../../../common/src/rf_modules/orderModule';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { messageSupersaverSe } from '../../../common/src/rf_pages/order';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);

const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Checkin baggage product verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Different choice of baggage for travellers', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult(), getFirstChild()]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfTravelers = 3;
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    0,
    'return trip',
    'STO',
    'LON',
    'ECONOMY',
    [11, 24],
  );

  await addBaggage(numberOfTravelers);

  // Same choice for all travellers
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerModule.cartCheckInBaggageProductMobile.visible)
      .ok()
      .expect(travelerModule.cartCheckInBaggageProductMobile.innerText)
      .contains(`${numberOfTravelers} Incheckat bagage`);
    await closeCart();
  }
  if (await isDesktop()) {
    await t
      .expect(travelerModule.cartCheckInBaggageProduct.visible)
      .ok()
      .expect(travelerModule.cartCheckInBaggageProduct.innerText)
      .contains(`${numberOfTravelers} Incheckat bagage`);
  }

  // No baggage for any travellers
  await addNoBaggage(numberOfTravelers);
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerModule.cartCheckInBaggageProductMobile.exists).notOk();
    await closeCart();
  }
  if (await isDesktop()) {
    await t.expect(travelerModule.cartCheckInBaggageProduct.exists).notOk();
  }

  // Different baggage choice for travellers, verify price for baggage
  const baggagePrice = await getBaggagePrice();
  const numberOfBounds = await getNumberOfBounds();
  const numberOfBaggages = 2;
  const totalCalculatedBaggagePrice = baggagePrice * numberOfBounds * numberOfBaggages;
  await addBaggageForTravelers(travelers);
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerModule.cartCheckInBaggageProductMobile.visible)
      .ok()
      .expect(travelerModule.cartCheckInBaggageProductMobile.innerText)
      .contains(`${numberOfBaggages} Incheckat bagage`);
    await t.expect(await getBaggageCartPrice()).eql(totalCalculatedBaggagePrice);
  }
  if (await isDesktop()) {
    await t
      .expect(travelerModule.cartCheckInBaggageProduct.visible)
      .ok()
      .expect(travelerModule.cartCheckInBaggageProduct.innerText)
      .contains(`${numberOfBaggages} Incheckat bagage`)
      .expect(await getBaggageCartPrice())
      .eql(totalCalculatedBaggagePrice);
  }
  await addTravelerInformation(travelers);
});

test('Baggage not available for infants', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  const numberOfTravelers = 4;
  const numberOfBaggages = 3;

  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'STO',
    'LON',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);

  const baggagePrice = await getBaggagePrice();
  const numberOfBounds = await getNumberOfBounds();
  const totalCalculatedBaggagePrice = baggagePrice * numberOfBounds * numberOfBaggages;

  await addNoExtraProducts(numberOfTravelers - numberOfInfants);
  await addBaggage(numberOfTravelers);

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerModule.cartCheckInBaggageProductMobile.visible).ok();
    await t
      .expect(travelerModule.cartCheckInBaggageProductMobile.innerText)
      .contains(`${numberOfBaggages} Incheckat bagage`);
    await t.expect(await getBaggageCartPrice()).eql(totalCalculatedBaggagePrice);
    await closeCart();
  }
  if (await isDesktop()) {
    await t
      .expect(travelerModule.cartCheckInBaggageProduct.visible)
      .ok()
      .expect(travelerModule.cartCheckInBaggageProduct.innerText)
      .contains(`${numberOfBaggages} Incheckat bagage`);
    await t.expect(await getBaggageCartPrice()).eql(totalCalculatedBaggagePrice);
  }
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.bankLabel.exists).ok('', { timeout: 90000 });
  await openCartIfClosed();
  await t
    .expect(paymentModule.cartCheckInBaggageProduct.visible)
    .ok()
    .expect(paymentModule.cartCheckInBaggageProduct.innerText)
    .contains(`${numberOfBaggages} Incheckat bagage`)
    .expect(await getBaggagePricePayment())
    .eql(totalCalculatedBaggagePrice);
  await payWithDummyBank();
  await t
    .expect(orderModule.infoTextOrderPage.visible)
    .ok('', { timeout: 90000 })
    .expect(orderModule.infoTextOrderPage.innerText)
    .contains(messageSupersaverSe);
});
