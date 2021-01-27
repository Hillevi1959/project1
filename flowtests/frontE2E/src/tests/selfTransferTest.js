/* eslint-disable no-await-in-loop */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import setProps from '../../../common/src/util/props';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import resultModule from '../../../common/src/rf_modules/resultModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { payWithDummyBank } from '../../../common/src/rf_pages/payment';
import orderModule from '../../../common/src/rf_modules/orderModule';
import config from '../../testdata.json';
import { filterSasLufthansa, selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import enableDebug from '../../../common/src/util/debug';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';
import { waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';

const url = getSiteUrl('supersaver-se', config.host);
const numberOfTravelers = 1;
const headerText = 'Egen transfer';
const selfTransferText = [
  'Hämta ditt bagage och gå till din avreseterminal',
  'Checka in igen, checka in ditt bagage och gå igenom säkerhetskontrollen.',
  'Anslutning skyddad genom vår Transfergaranti',
];
const props = {
  'IbeClient.TravelerDetails.Modal': 'SEATMAP',
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.ForceShowAddressFields.Carriers': '',
  'Payment.RemoveAdressForBank.Enable': false,
};

fixture(`Verification of self transfer information on trip`)
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

test('Self transfer information shown on all pages', async () => {
  const travelers = addNumberToTraveler([getFirstAdult()]);
  await searchTrip(numberOfTravelers, 0, 0, 'return trip', 'Stockholm', 'Bangkok', 'ECONOMY', [
    11,
    24,
  ]);

  // Verification on result page
  await t.expect(resultModule.resultPage.visible).ok('', { timeout: 20000 });
  await filterSasLufthansa();

  await t.expect(resultModule.selfTransferTrip.nth(0).visible).ok();
  await t.click(resultModule.toggleTrip(0));

  await t.expect(resultModule.selfTransferTrip.nth(0).innerText).contains(headerText);
  for (let i = 0; i < 3; i += 1) {
    await t.expect(resultModule.selfTransferText.nth(i).innerText).contains(selfTransferText[i]);
  }

  await selectTripButtonByIndex(0);

  // Verification on traveler-details page
  await t.expect(travelerDetailsModule.selfTransferInformationText.visible).ok();
  await t.click(travelerDetailsModule.tripDetailsArrow);

  await t.expect(travelerDetailsModule.selfTransferHeader.nth(0).innerText).contains(headerText);
  await t.expect(travelerDetailsModule.selfTransferHeader.nth(1).innerText).contains(headerText);
  for (let i = 0; i < 3; i += 1) {
    await t
      .expect(travelerDetailsModule.selfTransferText.nth(i).innerText)
      .contains(selfTransferText[i]);
  }
  for (let i = 3; i < 6; i += 1) {
    await t
      .expect(travelerDetailsModule.selfTransferText.nth(i).innerText)
      .contains(selfTransferText[i - 3]);
  }

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfTravelers);
  await bookFlight();
  await closeSeatMapModal();

  // Verification on payment page
  await t.expect(paymentModule.selfTransferInformationText.visible).ok();
  await t.click(paymentModule.tripDetailsToggleButton);
  await t.expect(paymentModule.selfTransferHeader.nth(0).innerText).contains(headerText);
  await t.expect(paymentModule.selfTransferHeader.nth(1).innerText).contains(headerText);
  for (let i = 0; i < 3; i += 1) {
    await t.expect(paymentModule.selfTransferText.nth(i).innerText).contains(selfTransferText[i]);
  }
  for (let i = 3; i < 6; i += 1) {
    await t
      .expect(paymentModule.selfTransferText.nth(i).innerText)
      .contains(selfTransferText[i - 3]);
  }
  await t.click(paymentModule.tripDetailsToggleButton);
  await payWithDummyBank();

  // Verification on order page
  await waitForOrderPageToLoad();

  await t.expect(orderModule.selfTransferInformationText.visible).ok();

  await t.click(orderModule.flightInfoButton);

  await t.expect(orderModule.selfTransferHeader.nth(0).innerText).contains(headerText);
  await t.expect(orderModule.selfTransferHeader.nth(1).innerText).contains(headerText);
  for (let i = 0; i < 3; i += 1) {
    await t.expect(orderModule.selfTransferText.nth(i).innerText).contains(selfTransferText[i]);
  }
  for (let i = 3; i < 6; i += 1) {
    await t.expect(orderModule.selfTransferText.nth(i).innerText).contains(selfTransferText[i - 3]);
  }
});
