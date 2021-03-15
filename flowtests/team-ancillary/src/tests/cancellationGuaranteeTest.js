import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import { getPriceFromText } from '../../../common/src/util/price';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import {
  addTravelerInformation,
  getNumberOfBounds,
  bookFlight,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import { payWithDummyBank } from '../../../common/src/rf_pages/payment';
import { messageSupersaverSe } from '../../../common/src/rf_pages/order';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
  getFirstChild,
  getFirstInfant,
} from '../../../common/src/util/travelerData';
import orderModule from '../../../common/src/rf_modules/orderModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);
const globalProps = {
  'IbeClient.TravelerDetails.Modal': 'NONE',
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.RemoveAdressForBank.Enable': false,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
};

fixture('Cancellation Guarantee Product verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await setProps(globalProps);
    await closeHeaderUrgencyBanner();
  });

test('Outside Europe - Price per bound and per traveler (except Infant)', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  await setProps({
    'IbeClient.Products.CancellationGuaranteeOutsideEu.ShowPricePerTraveler.Enabled': true,
  });
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'GOT',
    'BKK',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cancellationYesOutsideEu);
    await toggleCart();
    await t.expect(travelerDetailsModule.cartCancellationOutsideEuProductMobile.visible).ok();
    await toggleCart();
  }
  if (await isDesktop()) {
    await t
      .click(travelerDetailsModule.cancellationYesOutsideEu)
      .expect(travelerDetailsModule.cartCancellationOutsideEuProductPrice.exists)
      .ok();
  }
  const totalPrice = getPriceFromText(
    await travelerDetailsModule.cancellationOutsideEuProductPrice.innerText,
  );
  const numberOfBounds = await getNumberOfBounds();
  if (await isDesktop()) {
    const cartPrice = getPriceFromText(
      await travelerDetailsModule.cartCancellationOutsideEuProductPrice.innerText,
    );
    const pricePerBoundAndTraveler = Math.floor(
      cartPrice / (numberOfBounds * (numberOfAdults + numberOfChildren)),
    );
    await t
      .expect(pricePerBoundAndTraveler)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationOutsideEuProductPrice.innerText)
      .contains(`per resväg och person`);
    await bookFlight();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationOutsideEuProductPrice.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPrice);
  }
  if ((await isMobile()) || (await isTablet())) {
    const cartPriceMobile = getPriceFromText(
      await travelerDetailsModule.cartCancellationOutsideEuProductPriceMobile.innerText,
    );
    const pricePerBoundAndTraveler = Math.floor(
      cartPriceMobile / (numberOfBounds * (numberOfAdults + numberOfChildren)),
    );
    await t
      .expect(pricePerBoundAndTraveler)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationOutsideEuProductPrice.innerText)
      .contains(`per resväg och person`);
    await bookFlight();
    await toggleCart();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationOutsideEuProductPriceMobile.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPriceMobile);
    await toggleCart();
  }
  await payWithDummyBank();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('Outside Europe - Price per bound only', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  await setProps({
    'IbeClient.Products.CancellationGuaranteeOutsideEu.ShowPricePerTraveler.Enabled': false,
  });
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'GOT',
    'BKK',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cancellationYesOutsideEu);
    await toggleCart();
    await t.expect(travelerDetailsModule.cartCancellationOutsideEuProductMobile.visible).ok();
    await toggleCart();
  }
  if (await isDesktop()) {
    await t
      .click(travelerDetailsModule.cancellationYesOutsideEu)
      .expect(travelerDetailsModule.cartCancellationOutsideEuProductPrice.exists)
      .ok();
  }
  const totalPrice = getPriceFromText(
    await travelerDetailsModule.cancellationOutsideEuProductPrice.innerText,
  );
  const numberOfBounds = await getNumberOfBounds();
  if (await isDesktop()) {
    const cartPrice = getPriceFromText(
      await travelerDetailsModule.cartCancellationOutsideEuProductPrice.innerText,
    );
    const pricePerBound = Math.floor(cartPrice / numberOfBounds);
    await t
      .expect(pricePerBound)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationOutsideEuProductPrice.innerText)
      .contains(`per resväg`);
    await bookFlight();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationOutsideEuProductPrice.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPrice);
  }
  if ((await isMobile()) || (await isTablet())) {
    const cartPriceMobile = getPriceFromText(
      await travelerDetailsModule.cartCancellationOutsideEuProductPriceMobile.innerText,
    );
    const pricePerBound = Math.floor(cartPriceMobile / numberOfBounds);
    await t
      .expect(pricePerBound)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationOutsideEuProductPrice.innerText)
      .contains(`per resväg`);
    await bookFlight();
    await toggleCart();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationOutsideEuProductPriceMobile.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPriceMobile);
    await toggleCart();
  }
  await payWithDummyBank();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('Within Europe - Price per bound and per traveler (except Infant)', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  await setProps({
    'IbeClient.Products.CancellationGuaranteeWithinEu.ShowPricePerTraveler.Enabled': true,
  });
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'GOT',
    'BER',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cancellationYesInsideEu);
    await toggleCart();
    await t.expect(travelerDetailsModule.cartCancellationInsideEuProductMobile.visible).ok();
    await toggleCart();
  }
  if (await isDesktop()) {
    await t
      .click(travelerDetailsModule.cancellationYesInsideEu)
      .expect(travelerDetailsModule.cartCancellationWithinEuProduct.exists)
      .ok();
  }
  const totalPrice = getPriceFromText(
    await travelerDetailsModule.cancellationWithinEuProductPrice.innerText,
  );
  const numberOfBounds = await getNumberOfBounds();
  if (await isDesktop()) {
    const cartPrice = getPriceFromText(
      await travelerDetailsModule.cartCancellationWithinEuProductPrice.innerText,
    );
    const pricePerBoundAndTraveler = Math.floor(
      cartPrice / (numberOfBounds * (numberOfAdults + numberOfChildren)),
    );
    await t
      .expect(pricePerBoundAndTraveler)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationWithinEuProductPrice.innerText)
      .contains(`per resväg och person`);
    await bookFlight();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationWithinEuProductPrice.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPrice);
  }
  if ((await isMobile()) || (await isTablet())) {
    const cartPriceMobile = getPriceFromText(
      await travelerDetailsModule.cartCancellationWithinEuProductPriceMobile.innerText,
    );
    const pricePerBoundAndTraveler = Math.floor(
      cartPriceMobile / (numberOfBounds * (numberOfAdults + numberOfChildren)),
    );
    await t
      .expect(pricePerBoundAndTraveler)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationWithinEuProductPrice.innerText)
      .contains(`per resväg och person`);
    await bookFlight();
    await toggleCart();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationWithinEuProductPriceMobile.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPriceMobile);
    await toggleCart();
  }
  await payWithDummyBank();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});

test('Within Europe - Price per bound only', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  await setProps({
    'IbeClient.Products.CancellationGuaranteeWithinEu.ShowPricePerTraveler.Enabled': false,
  });
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'GOT',
    'BER',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  if ((await isMobile()) || (await isTablet())) {
    await t.click(travelerDetailsModule.cancellationYesInsideEu);
    await toggleCart();
    await t.expect(travelerDetailsModule.cartCancellationInsideEuProductMobile.visible).ok();
    await toggleCart();
  }
  if (await isDesktop()) {
    await t
      .click(travelerDetailsModule.cancellationYesInsideEu)
      .expect(travelerDetailsModule.cartCancellationWithinEuProduct.exists)
      .ok();
  }
  const totalPrice = getPriceFromText(
    await travelerDetailsModule.cancellationWithinEuProductPrice.innerText,
  );
  const numberOfBounds = await getNumberOfBounds();
  if (await isDesktop()) {
    const cartPrice = getPriceFromText(
      await travelerDetailsModule.cartCancellationWithinEuProductPrice.innerText,
    );
    const pricePerBound = Math.floor(cartPrice / numberOfBounds);
    await t
      .expect(pricePerBound)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationWithinEuProductPrice.innerText)
      .contains(`per resväg`);
    await bookFlight();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationWithinEuProductPrice.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPrice);
  }
  if ((await isMobile()) || (await isTablet())) {
    const cartPriceMobile = getPriceFromText(
      await travelerDetailsModule.cartCancellationWithinEuProductPriceMobile.innerText,
    );
    const pricePerBound = Math.floor(cartPriceMobile / numberOfBounds);
    await t
      .expect(pricePerBound)
      .eql(totalPrice)
      .expect(travelerDetailsModule.cancellationWithinEuProductPrice.innerText)
      .contains(`per resväg`);
    await bookFlight();
    await toggleCart();
    const paymentCartPrice = getPriceFromText(
      await paymentModule.cartCancellationWithinEuProductPriceMobile.innerText,
    );
    await t.expect(paymentCartPrice).eql(cartPriceMobile);
    await toggleCart();
  }
  await payWithDummyBank();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
});
