/* eslint-disable no-console */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import { makeSearch, selectTravelersDesktop } from '../../../common/src/pages/start';
import { selectFirstTripDesktop } from '../../../common/src/pages/searchResults';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import config from '../../testdata.json';

const url = getSiteUrl('UK', config.host);

fixture(`Search on device and redirect to responsive flow`)
  .page(url)
  .beforeEach(async () => {
    await acceptCookies();
    await enableDebug();
    await selectProvider('IbeGDSDummy');
  });

test('Search on desktop, redirect to travler details page', async () => {
  const nrOfAdults = 1;
  const props = {
    'Desktop.Result.RedirectToResponsiveFlow': true,
  };

  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
  } else if (await isDesktop()) {
    await setProps(props);
    await selectTravelersDesktop(nrOfAdults, 0, []);
    await makeSearch('return trip', 'STO', 'LON');
    await selectFirstTripDesktop();
    await t.expect(travelerDetailsModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  }
});
