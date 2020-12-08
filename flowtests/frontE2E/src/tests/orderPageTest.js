import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import {
  addAllExtraProducts,
  countProductsInCart,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import orderModule from '../../../common/src/rf_modules/orderModule';
import config from '../../testdata.json';
import {
  saveSeatMapSelections,
  selectSeatsForAllSegmentTypes,
} from '../../../common/src/rf_pages/seatMap';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
};
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
const origin = 'Stockholm';
const destination = 'London';
let orderNumber = '';

async function selectTripAddProductsAndPay() {
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'NYO',
    'LON',
  );
  await addTravelerInformation(travelers);
  await addAllExtraProducts(numberOfAdults + numberOfChildren, travelers);
  const nrOfProducts = await countProductsInCart();
  await bookFlight();
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
  await payWithCreditCard();
  return nrOfProducts;
}

fixture('Verify information on order page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Possible to show all information on order page', async () => {
  const nrOfProductsWithoutSeatMap = await selectTripAddProductsAndPay();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
  await t.expect(orderModule.travelDocumentButton.visible).ok();
  await t.expect(orderModule.moreInfoButton.visible).ok();
  await t.expect(orderModule.seeAllProductsButton.visible).ok();
  await t.expect(orderModule.printConfirmationButton.visible).ok();
  await t.expect(orderModule.mailConfirmationButton.visible).ok();

  // Verify tripdetails
  await t.expect(orderModule.tripSegment.count).eql(2);
  await t.click(orderModule.flightInfoButton);
  await t.expect(orderModule.tripSegment.count).eql(4);
  await t.click(orderModule.flightInfoButton);

  // Verify baggage information
  await t.click(orderModule.showBaggageButton);
  await t.expect(orderModule.baggageDetails.count).eql(4);
  await t.click(orderModule.showBaggageButton);

  // Verify correct travelers and product information
  await t.expect(orderModule.tripInformation.innerText).contains(origin);
  await t.expect(orderModule.tripInformation.innerText).contains(destination);
  await t.expect(orderModule.tripInformation.innerText).contains('1 child');
  await t.expect(orderModule.tripInformation.innerText).contains('1 infant');
  await t.expect(orderModule.tripInformation.innerText).contains('2 adults');
  await t.expect(orderModule.seatMapProduct.visible).ok();
  await t.expect(orderModule.allProductsInOrder.count).eql(nrOfProductsWithoutSeatMap + 1);
  orderNumber = await orderModule.orderNumber.innerText;

  // Verify order login
  if ((await isMobile()) || (await isTablet())) {
    await t.click(orderModule.myBookingsButtonMobile);
  } else if (await isDesktop()) {
    await t.click(orderModule.myBookingsButtonOrderPage);
  }
  await t.click(orderModule.myBookingsLogOutButton);

  await t
    .typeText(orderModule.myBookingsEmailInput, travelers[0].email)
    .typeText(orderModule.myBookingsOrderNumberInput, orderNumber)
    .click(orderModule.myBookingsLogInButton);

  // Verify all data
  await t.click(orderModule.chooseOrderButton);
  await t.expect(orderModule.infoTextOrderPage.visible).ok('', { timeout: 50000 });
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
  await t.expect(orderModule.travelDocumentButton.visible).ok();
  await t.expect(orderModule.moreInfoButton.visible).ok();
  await t.expect(orderModule.seeAllProductsButton.visible).ok();
  await t.expect(orderModule.printConfirmationButton.visible).ok();
  await t.expect(orderModule.mailConfirmationButton.visible).ok();
  // Verify tripdetails
  await t.expect(orderModule.tripSegment.count).eql(2);
  await t.click(orderModule.flightInfoButton);
  await t.expect(orderModule.tripSegment.count).eql(4);
  await t.click(orderModule.flightInfoButton);
  // Verify baggage information
  await t.click(orderModule.showBaggageButton);
  await t.expect(orderModule.baggageDetails.count).eql(4);
  await t.click(orderModule.showBaggageButton);
  // Verify correct travelers and product information
  await t.expect(orderModule.tripInformation.innerText).contains(origin);
  await t.expect(orderModule.tripInformation.innerText).contains(destination);
  await t.expect(orderModule.tripInformation.innerText).contains('1 child');
  await t.expect(orderModule.tripInformation.innerText).contains('1 infant');
  await t.expect(orderModule.tripInformation.innerText).contains('2 adults');
  await t.expect(orderModule.seatMapProduct.visible).ok();
  await t.expect(orderModule.allProductsInOrder.count).eql(nrOfProductsWithoutSeatMap + 1);
});
