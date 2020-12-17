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
import { selectTripButtonNumber } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'IbeClient.DisplayProgressSteps.Enabled': true,
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
};

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
  const numberOfAdults = 2;
  // Result page
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'Athens');

  await t.expect(resultModule.headerNavigationMenu.visible).ok();

  await selectTripButtonNumber(0);
  // Traveler details page
  await t.expect(travelerDetailsModule.stepIndicatorVisited.count).eql(1);
  await t.expect(travelerDetailsModule.stepIndicator.count).eql(4);
  await t
    .expect(travelerDetailsModule.stepIndicator.nth(0).getStyleProperty('font-weight'))
    .eql('700');
  await t
    .expect(travelerDetailsModule.stepIndicator.nth(0).innerText)
    .contains('Traveler information');

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  // Payment page
  await t.expect(travelerDetailsModule.stepIndicatorVisited.count).eql(3);
  await t.expect(travelerDetailsModule.stepIndicator.count).eql(2);
  await t
    .expect(travelerDetailsModule.stepIndicator.nth(0).getStyleProperty('font-weight'))
    .eql('700');
  await t.expect(travelerDetailsModule.stepIndicator.nth(0).innerText).contains('Payment');

  await payWithCreditCard();

  //  Order page
  await waitForOrderPageToLoad();
  await t.expect(travelerDetailsModule.stepIndicatorVisited.count).eql(4);
  await t.expect(travelerDetailsModule.stepIndicator.count).eql(1);
  await t
    .expect(travelerDetailsModule.stepIndicator.nth(0).getStyleProperty('font-weight'))
    .eql('700');
  await t.expect(travelerDetailsModule.stepIndicator.nth(0).innerText).contains('Confirmation');
});
