import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { goBack } from '../../../common/src/util/clientFunction';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import errorModalModule from '../../../common/src/rf_modules/errorModalModule';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import startModule from '../../../common/src/rf_modules/startModule';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);

const numberOfAdults = 2;
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
};

fixture('Error modal verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    // await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });
// Tests for session timeout cannot be don until WEB-3751 is completed
test('Click back with browser arrow om payment page and choose back to traveler details page', async () => {
  const errorText1 =
    "We're sorry! Unfortunately, you cannot return to this page. Click the button below to return to the payment page. If you would like to change a name or product, please start with a new booking.";
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.paymentContainer.visible).ok();
  await goBack();
  await t.expect(errorModalModule.paymentErrorTextContent.innerText).contains(errorText1);
  await t.click(errorModalModule.buttonContinue);
  await t.expect(paymentModule.paymentContainer.visible).ok();
});

test('Click back with browser arrow on payment page and choose back to search page', async () => {
  const errorText1 =
    "We're sorry! Unfortunately, you cannot return to this page. Click the button below to return to the payment page. If you would like to change a name or product, please start with a new booking.";
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();
  await t.expect(paymentModule.paymentContainer.visible).ok();
  await goBack();
  await t.expect(errorModalModule.paymentErrorTextContent.innerText).contains(errorText1);
  await t.click(errorModalModule.buttonContinue.nth(1));
  await t.expect(startModule.startPageSearchForm.visible).ok();
});
