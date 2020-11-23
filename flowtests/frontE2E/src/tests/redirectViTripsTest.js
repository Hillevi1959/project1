/* eslint-disable no-console */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { makeSearch, selectTravelersDesktop } from '../../../common/src/pages/start';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import { selectViTripDesktop } from '../../../common/src/pages/searchResults';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import config from '../../testdata.json';

const url = `${getSiteUrl('SE', config.host)}/flyg`;
const props = {
  'Desktop.Result.RedirectToResponsiveFlowForVI.Enable': true,
};

fixture('Redirect VI trips from desktop result page to responsive flow')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
  });

test('Redirect VI trips from desktop result page to responsive flow', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult(), getFirstChild()]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;

  if ((await isMobile()) || (await isTablet())) {
    console.warn('This test is not run on mobile or tablet device');
  } else if (await isDesktop()) {
    await selectTravelersDesktop(numberOfAdults, numberOfChildren, travelers[2].age);
    await makeSearch('return trip', 'STO', 'NEW');
    await selectViTripDesktop();
    await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  }
});
