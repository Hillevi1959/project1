import { t } from 'testcafe';
// eslint-disable-next-line import/named
import { acceptCookies, getSiteUrl, getOrderNumberFromUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import {
  addNoExtraProducts,
  countProductsInCart,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  saveSeatMapSelections,
  selectSeatsForAllSegmentTypes,
} from '../../../common/src/rf_pages/seatMap';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

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
  'Invoice.Generation.Enabled': 'true',
};
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
// const origin = 'Stockholm';
// const destination = 'London';
let orderNumberOnOrderPage = '';

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
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  const nrOfProducts = await countProductsInCart();
  await bookFlight();
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
  await payWithCreditCard();
  return nrOfProducts;
}

fixture('Verify invoice possibility')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Verify order number in pdf url for invoice created on order page after payment', async () => {
  await selectTripAddProductsAndPay();
  await waitForOrderPageToLoad();
  orderNumberOnOrderPage = await orderModule.orderNumber.innerText;
  await t.click(orderModule.printConfirmationButton);

  await t
    .typeText(orderModule.companyInformationAddress, travelers[0].street)
    .typeText(orderModule.companyInformationName, travelers[0].company)
    .typeText(orderModule.companyInformationCompanyAddress, 'Box 123')
    .typeText(orderModule.companyInformationCity, travelers[0].city)
    .typeText(orderModule.companyInformationZipCode, travelers[0].zipCode)
    .typeText(orderModule.companyInformationVatNumber, travelers[0].vatNumber);
  await t.click(orderModule.printBusinessReceiptButton);
  // await t.switchToIframe(orderModule.pdfIframe);
  await t.expect(orderModule.pdfIframe.visible).ok();
  // await t.expect(orderModule.openPdfFileButton.visible).ok();
  const orderNumberInUrl = await getOrderNumberFromUrl();

  await t.expect(orderNumberOnOrderPage).eql(orderNumberInUrl);
});
