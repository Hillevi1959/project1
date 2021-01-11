import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addAllExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { addCheckoutData, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import orderModule from '../../../common/src/rf_modules/orderModule';
import config from '../../testdata.json';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'Checkout',
};

fixture('Pay with credit card to verify Payment Service Provider')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Search trip, book all products, pay with credit card', async () => {
  const numberOfAdults = 2;

  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addAllExtraProducts(numberOfAdults, travelers);
  await bookFlight();
  await closeSeatMapModal();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.receiptInformation.innerText).contains('Debitcard/Creditcard (VISA)');
});
