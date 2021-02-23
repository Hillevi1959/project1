import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import {
  addTravelDocuments,
  addTravelerInformation,
  bookFlight,
} from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import setProps, { addNewPropInEdvin } from '../../../common/src/util/props';

const url = getSiteUrl('supersaver-ru', config.host);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'TD.Passport.DocumentType.Enabled': true,
};
const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;
const numberOfTravelers = numberOfAdults + numberOfChildren;

fixture('Travel document for domestic Russian trips').beforeEach(async () => {
  await addNewPropInEdvin('gotogate-ru', 'TD.Passport.DocumentType.Enabled', 'true', 'ibe');
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
});

test('Domestic trip with russian passport', async () => {
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'Moscow',
    'Kazan',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers, 'YYYYMMDD');
  await addTravelDocuments(travelers, 'YYYYMMDD', 'Russia', 0);
  await addNoExtraProducts(numberOfTravelers);
  await bookFlight();
  await payWithCreditCard();
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
});
