import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import paymentModule from '../../../common/src/rf_modules/paymentModule';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'IbeClient.DisplayProgressSteps.Enabled': true,
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
};
const numberOfAdults = 2;

fixture('Verify step indicator in booking flow')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Verify step indicator in booking flow', async () => {
  // Result page
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'Athens', 'ECONOMY', [11, 24]);

  await t.expect(resultModule.resultPage.visible).ok();
  await t.expect(resultModule.stepIndicatorVisited.count).eql(0);
  await t.expect(resultModule.stepIndicatorNotVisited.count).eql(4);
  await t.expect(resultModule.stepIndicatorCurrent.innerText).contains('Flight Selection');

  await selectTripButtonByIndex(0);
  // Traveler details page
  await t.expect(travelerDetailsModule.stepIndicatorVisited.count).eql(1);
  await t.expect(travelerDetailsModule.stepIndicatorNotVisited.count).eql(3);
  await t
    .expect(travelerDetailsModule.stepIndicatorCurrent.innerText)
    .contains('Traveler information');

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  // Payment page
  await t.expect(paymentModule.stepIndicatorVisited.count).eql(3);
  await t.expect(paymentModule.stepIndicatorNotVisited.count).eql(1);
  await t.expect(paymentModule.stepIndicatorCurrent.innerText).contains('Payment');

  await payWithCreditCard();
  //  Order page
  await waitForOrderPageToLoad();

  await t.expect(paymentModule.stepIndicatorVisited.count).eql(4);
  await t.expect(paymentModule.stepIndicatorNotVisited.count).eql(0);
  await t.expect(paymentModule.stepIndicatorCurrent.innerText).contains('Confirmation');
});

test.before(async () => {
  const urlDe = getSiteUrl('gotogate-de', config.host);
  await t.navigateTo(urlDe);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Step indicator not visible for seatmap when seatmap not available', async () => {
  // Result page
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'London', 'ECONOMY', [11, 24]);

  await t.debug();

  await t.expect(resultModule.resultPage.visible).ok();
  await t.expect(resultModule.stepIndicatorVisited.count).eql(0);
  await t.expect(resultModule.stepIndicatorNotVisited.count).eql(4);
  await t.expect(resultModule.stepIndicatorCurrent.innerText).contains('Flight Selection');

  await selectTripButtonByIndex(0);
  // Traveler details page
  await t.expect(travelerDetailsModule.stepIndicatorVisited.count).eql(1);
  await t.expect(travelerDetailsModule.stepIndicatorNotVisited.count).eql(2);
  await t
    .expect(travelerDetailsModule.stepIndicatorCurrent.innerText)
    .contains('Traveler information');
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  // Payment page
  await t.expect(paymentModule.paymentContainer.visible).ok();

  await t.expect(paymentModule.stepIndicatorVisited.count).eql(2);
  await t.expect(paymentModule.stepIndicatorNotVisited.count).eql(1);
  await t.expect(paymentModule.stepIndicatorCurrent.innerText).contains('Payment');

  await payWithCreditCard();
  //  Order page
  await waitForOrderPageToLoad();

  await t.expect(paymentModule.stepIndicatorVisited.count).eql(3);
  await t.expect(paymentModule.stepIndicatorNotVisited.count).eql(0);
  await t.expect(paymentModule.stepIndicatorCurrent.innerText).contains('Confirmation');
});
