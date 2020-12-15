import { t } from 'testcafe';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import config from '../../testdata.json';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { goBack, goForward } from '../../../common/src/util/clientFunction';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import startModule from '../../../common/src/rf_modules/startModule';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import { toggleCart } from '../../../common/src/rf_pages/travelerDetails';

const url = getSiteUrl('gotogate-uk', config.host);
const numberOfAdults = 2;

fixture('Browser navigation verification')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await closeHeaderUrgencyBanner();
  });

test('Click twice on select trip, go back from TD page', async () => {
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'Wichita', 10);
  await t.expect(resultModule.bookFlightButton.exists).ok('', { timeout: 60000 });
  await t.doubleClick(resultModule.bookFlightButton);
  await t.expect(travelerDetailsModule.travelerDetailsPage.visible).ok();
  await goBack();
  await t.expect(resultModule.resultPage.exists).ok();
  await t.click(resultModule.bookFlightButton);
  await t.expect(travelerDetailsModule.travelerDetailsPage.visible).ok();
});

test('Back from result, forward from start', async () => {
  let tripDate;
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'Wichita', 10);
  await t.expect(resultModule.resultPage.exists).ok('', { timeout: 5000 });
  if (await isMobile()) {
    tripDate = await resultModule.tripTitleDateMobile.innerText;
  } else if ((await isTablet()) || (await isDesktop())) {
    tripDate = await resultModule.tripTitleDate.innerText;
  }
  await goBack();
  await t.expect(startModule.startPageSearchForm.visible).ok();
  await goForward();
  await t.expect(resultModule.resultPage.exists).ok();
  await t.expect(resultModule.tripTitleFlight.innerText).contains('Stockholm\n–\nWichita');
  if (await isMobile()) {
    await t.expect(resultModule.tripTitleDateMobile.innerText).contains(tripDate);
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.expect(resultModule.tripTitleDate.innerText).contains(tripDate);
  }
  await t.click(resultModule.bookFlightButton);
  await t.expect(travelerDetailsModule.travelerDetailsPage.visible).ok();
  if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(travelerDetailsModule.cartFlightMobile.nth(0).innerText).contains('Stockholm');
    await t.expect(travelerDetailsModule.cartFlightMobile().nth(1).innerText).contains('Wichita');
  } else {
    await t.expect(travelerDetailsModule.cartFlight.nth(0).innerText).contains('Stockholm');
    await t.expect(travelerDetailsModule.cartFlight.nth(1).innerText).contains('Wichita');
  }
});
