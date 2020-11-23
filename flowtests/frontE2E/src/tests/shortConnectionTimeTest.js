import { t } from 'testcafe';
import setProps from '../../../common/src/util/props';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import { filterSasLufthansa, selectTripNumber } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { payWithDummyBank } from '../../../common/src/rf_pages/payment';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import enableDebug from '../../../common/src/util/debug';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('supersaver-se', config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.ShowNoSelfTransferGuaranteeInfo.MinLayoverMinutes': 181, // stopover < 3h
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.RemoveAdressForBank.Enable': false,
};
const numberOfTravelers = 1;
const travelers = addNumberToTraveler([getFirstAdult()]);

fixture(`Verification of short connection time notification`)
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Show short connection time notification', async () => {
  await searchTrip(numberOfTravelers, 0, 0, 'return trip', 'Stockholm', 'Bangkok');
  await filterSasLufthansa();
  await selectTripNumber(0);

  // Verification on traveler-details page
  await t.expect(travelerDetailsModule.travelerDetailsPage.visible).ok();
  await t.expect(travelerDetailsModule.shortConnectionNotification.visible).ok();
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfTravelers);
  await bookFlight();
  await closeSeatMapModal();

  // Verification on payment page
  await t.expect(paymentModule.paymentContainer.visible).ok('', { timeout: 60000 });
  await t.expect(paymentModule.shortConnectionNotification.visible).ok();
  await payWithDummyBank(travelers[0]);

  // Verification on order page
  await waitForOrderPageToLoad();
  await t.expect(orderModule.shortConnectionNotification.visible).ok();
});
