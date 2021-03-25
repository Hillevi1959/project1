import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import {
  closeHeaderUrgencyBanner,
  getTripDate,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import { toggleCart } from '../../../common/src/rf_pages/travelerDetails';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import config from '../../testdata.json';
import { addSearchDataResultPage } from '../../../common/src/rf_pages/result';
import { getExpectedDate } from '../../../common/src/util/dateFunction';

const url = getSiteUrl('gotogate-uk', config.host);
const props = {
  'IbeClient.TravelerDetails.showCollapsedTripDetails.Enabled': false,
};

fixture(`Verify possibility to search for trip on result page`)
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Possible to search for a new trip on result page', async () => {
  const numberOfAdults = 1;

  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'UME', 'TYO', [11, 24]);

  await t
    .expect(resultModule.tripSegment.innerText)
    .contains('Umeå')
    .expect(resultModule.tripSegment.innerText)
    .contains('Tokyo');
  const expectedDateDeparture = getExpectedDate(4, 11);
  const expectedDateReturn = getExpectedDate(4, 24);
  await addSearchDataResultPage(1, 'STO', 'SYD', 1, 1);
  const inputDateDeparture = await getTripDate(resultModule.departureDate);
  const inputDateReturn = await getTripDate(resultModule.returnDate);
  await t.click(resultModule.searchFlight);
  await t.click(resultModule.searchFormButton);

  await t.expect(inputDateDeparture).eql(expectedDateDeparture);
  await t.expect(inputDateReturn).eql(expectedDateReturn);

  await t.click(resultModule.searchFormButton);
  await t
    .expect(resultModule.tripSegment.innerText)
    .contains('Stockholm')
    .expect(resultModule.tripSegment.innerText)
    .contains('Sydney');

  await t.click(resultModule.bookFlightButton);

  await t
    .expect(travelerDetailsModule.tripSegment.nth(0).innerText)
    .contains('Stockholm')
    .expect(travelerDetailsModule.tripSegment.nth(1).innerText)
    .contains('Sydney');

  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t
      .expect(travelerDetailsModule.cartFlightMobile.nth(0).innerText)
      .contains('Stockholm')
      .expect(travelerDetailsModule.cartFlightMobile.nth(1).innerText)
      .contains('Sydney');

    await t.click(travelerDetailsModule.cartTravelerToggleButtonMobile);

    await t
      .expect(travelerDetailsModule.cartPassengersMobile.nth(0).innerText)
      .contains('2 adults')
      .expect(travelerDetailsModule.cartPassengersMobile.nth(1).innerText)
      .contains('1 child')
      .expect(travelerDetailsModule.cartPassengersMobile.nth(2).innerText)
      .contains('1 infant');
  } else if (await isDesktop()) {
    await t
      .expect(travelerDetailsModule.cartFlight.nth(0).innerText)
      .contains('Stockholm')
      .expect(travelerDetailsModule.cartFlight.nth(1).innerText)
      .contains('Sydney');

    await t.click(travelerDetailsModule.tripDetailsArrow);
    await t.click(travelerDetailsModule.cartTravelerToggleButton);

    await t
      .expect(travelerDetailsModule.cartPassengers.nth(0).innerText)
      .contains('2 adults')
      .expect(travelerDetailsModule.cartPassengers.nth(1).innerText)
      .contains('1 child')
      .expect(travelerDetailsModule.cartPassengers.nth(2).innerText)
      .contains('1 infant');
  }
});
