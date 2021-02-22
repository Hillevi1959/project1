import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { payWithDummyBank } from '../../../common/src/rf_pages/payment';
import { addMeal, addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import {
  clickGoToPayment,
  getOrderNumber,
  loadPostBookingLogIn,
} from '../../../common/src/rf_pages/postBookingProduct';
import { logInToPostBooking } from '../../../common/src/rf_pages/postBooking';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import postbookingModule from '../../../common/src/rf_modules/postbookingModule';
import config from './testdata.json';

const url = getSiteUrl('supersaver-se', config.host);

const propsOverlay = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture('Meal Post Booking Test')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await setProps(propsOverlay);
    await closeHeaderUrgencyBanner();
    await selectProvider('IbeGDSDummy');
  });

test('Book and pay for a trip - add meal in post booking', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  const numberOfAdults = 1;
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'LON', [11, 24]);
  await selectTripButtonByIndex(0);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();
  await closeSeatMapModal();

  await payWithDummyBank();
  const orderModuleNumber = await getOrderNumber();
  const postBookingUrl = getSiteUrl('postbooking-supersaver-se', config.host);
  await loadPostBookingLogIn(postBookingUrl);
  await logInToPostBooking(travelers[0].email, orderModuleNumber);
  await addMeal(numberOfAdults);

  await clickGoToPayment();
  await t.expect(postbookingModule.cartMealProductIcon.visible).ok();
  await payWithDummyBank();
  await waitForOrderPageToLoad();

  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);
  await t.expect(postbookingModule.cartMealProduct.visible).ok();
});
