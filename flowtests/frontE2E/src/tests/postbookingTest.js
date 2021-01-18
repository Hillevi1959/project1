/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { t } from 'testcafe';
import { acceptCookies, getOrderNumberFromUrl, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import {
  goToPostbookingFromOrderPage,
  messageSupersaverSe,
  waitForOrderPageToLoad,
} from '../../../common/src/rf_pages/order';
import {
  addAllProducts,
  addProducts,
  clickGoToPayment,
  createOrderFlowWithProducts,
  getOrderNumber,
  loadPostBookingLogIn,
  openProductsInCart,
} from '../../../common/src/rf_pages/postBookingProduct';
import { logInToPostBooking, payPostbooking } from '../../../common/src/rf_pages/postBooking';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { isMobile, isTablet } from '../../../common/src/util/device';
import orderModule from '../../../common/src/rf_modules/orderModule';
import postbookingModule from '../../../common/src/rf_modules/postbookingModule';
import config from '../../testdata.json';
import { closeHeaderUrgencyBanner } from '../../../common/src/rf_pages/start';
import { createOrderWithNoProducts } from '../../../common/src/util/createOrder';
import { dropdownSelect } from '../../../common/src/util/dropdownSelect';
import { addCheckoutData } from '../../../common/src/rf_pages/payment';

const url = getSiteUrl('supersaver-se', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const numberOfAdults = 2;
const numberOfChildren = 0;
const numberOfInfants = 0;
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
};

fixture('Postbooking verification')
  .page(url)
  .beforeEach(async () => {
    if ((await isMobile()) || (await isTablet())) {
      console.log('This test is not run on mobile or tablet device');
      return;
    }
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Go to postbooking from orderModule page, add all products', async () => {
  if ((await isMobile()) || (await isTablet())) {
    console.log('This test is not run on mobile or tablet device');
    return;
  }
  await createOrderWithNoProducts(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    travelers,
    'return trip',
    'STO',
    'AMS',
    'CARD',
    'ECONOMY',
    [11, 24],
  );
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
  await goToPostbookingFromOrderPage();

  await t.expect(postbookingModule.cartOpenProductsButton.exists).notOk();

  await addAllProducts();
  await t.expect(postbookingModule.cartAllExtraProductsTdPage.exists).ok('', { timeout: 50000 });
  const numberOfAddedProducts = await postbookingModule.cartAllExtraProductsTdPage.count;
  await clickGoToPayment();

  await t.expect(postbookingModule.cartContentPayment.exists).ok('', { timeout: 50000 });
  await t.expect(postbookingModule.cartExtraProductsPayment.count).eql(numberOfAddedProducts);

  await payPostbooking();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  const numberOfProducts = await orderModule.postBookingProducts.count;

  await t.expect(numberOfProducts).eql(numberOfAddedProducts);
});

test('Log in to postbooking from login page, and add all products', async () => {
  if ((await isMobile()) || (await isTablet())) {
    console.log('This test is not run on mobile or tablet device');
    return;
  }
  await createOrderWithNoProducts(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    travelers,
    'return trip',
    'STO',
    'AMS',
    'CARD',
    'ECONOMY',
    [11, 24],
  );
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);

  const orderModuleNumber = await getOrderNumber();
  const postBookingUrl = getSiteUrl('postbooking-supersaver-se', config.host);
  await loadPostBookingLogIn(postBookingUrl);
  await logInToPostBooking(travelers[0].email, orderModuleNumber);

  await t.expect(postbookingModule.cartOpenProductsButton.exists).notOk();

  await addAllProducts();

  await t.expect(postbookingModule.cartAllExtraProductsTdPage.exists).ok('', { timeout: 50000 });
  const numberOfAddedProducts = await postbookingModule.cartAllExtraProductsTdPage.count;
  await clickGoToPayment();
  await t.expect(postbookingModule.cartContentPayment.exists).ok('', { timeout: 50000 });

  await t.expect(postbookingModule.cartExtraProductsPayment.count).eql(numberOfAddedProducts);

  await payPostbooking();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  const numberOfProducts = await orderModule.postBookingProducts.count;

  await t.expect(numberOfProducts).eql(numberOfAddedProducts);
});

test('Only not selected products are available in postbooking', async () => {
  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
    return;
  }
  const numberOfAddedExtraProducts = 2;
  await createOrderFlowWithProducts(travelers);
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
  const orderNumberOnOrderPage = await orderModule.orderNumber.innerText;
  await goToPostbookingFromOrderPage();
  await openProductsInCart();

  await t
    .expect(postbookingModule.cartContentExistingExtraProducts.count)
    .eql(numberOfAddedExtraProducts);

  await addProducts(travelers.length);
  await t.expect(postbookingModule.cartAddedExtraProducts.exists).ok();
  const addedNumberOfExtraProducts = await postbookingModule.cartAddedExtraProducts.count;
  await clickGoToPayment();

  await t.expect(postbookingModule.cartExtraProductsPayment.count).eql(addedNumberOfExtraProducts);

  await payPostbooking();
  await addCheckoutData();
  await waitForOrderPageToLoad();

  const numberOfExtraProductsOrderPage = await orderModule.postBookingProducts.count;
  await t.expect(numberOfExtraProductsOrderPage).eql(addedNumberOfExtraProducts);

  await t.click(orderModule.printConfirmationButton);
  await dropdownSelect(orderModule.printBusinessReceiptDropdown, 1);

  await t
    .typeText(orderModule.companyInformationAddress, travelers[0].street)
    .typeText(orderModule.companyInformationName, travelers[0].company)
    .typeText(orderModule.companyInformationCompanyAddress, 'Box 123')
    .typeText(orderModule.companyInformationCity, travelers[0].city)
    .typeText(orderModule.companyInformationZipCode, travelers[0].zipCode)
    .typeText(orderModule.companyInformationVatNumber, travelers[0].vatNumber);

  await t
    .expect(orderModule.printBusinessReceiptDropdown.innerText)
    .contains(`${orderNumberOnOrderPage}-1`);

  await t.click(orderModule.printBusinessReceiptButton);
  const orderNumberInUrl = await getOrderNumberFromUrl();

  await t.expect(orderNumberOnOrderPage).eql(orderNumberInUrl);
});
