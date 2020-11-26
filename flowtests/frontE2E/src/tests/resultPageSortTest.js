import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import resultModule from '../../../common/src/rf_modules/resultModule';
import config from '../../testdata.json';
import setProps from '../../../common/src/util/props';
import { selectProvider } from '../../../common/src/util/debugOptions';

const url = getSiteUrl('gotogate-uk', config.host);
const numberOfAdults = 1;
const props = {
  'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
  'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
};

fixture(`Verify quick filter sorting on result page`)
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
    await selectTravelers(numberOfAdults, 0, 0);
    await makeSearch('return trip', 'STO', 'SYD', 10);
  });

test('Verify quick filter sorting on result page', async () => {
  await t.expect(resultModule.cheapestFilterButton.visible).ok('', { timeout: 10000 });
  await t.click(resultModule.cheapestFilterButton);
  await t.expect(resultModule.topTripHeader.innerText).eql('Cheapest');

  await t.click(resultModule.shortestFilterButton);
  await t.expect(resultModule.topTripHeader.innerText).eql('Shortest');
});
