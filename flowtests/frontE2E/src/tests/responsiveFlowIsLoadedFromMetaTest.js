import { Selector, t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import getTrip from '../../../common/src/util/metaTrips';
import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import config from '../../testdata.json';

const url = getSiteUrl('SE-meta', config.host);
const props = {
  'Feature.NewResponsive.Enabled': true,
  'IbeClient.MetaEntry.WithResultsSupport.Enabled': false,
};

fixture('Meta trips in Responsive flow')
  .page(url)
  .beforeEach(async () => {
    const tripUrl = await getTrip(url);

    await enableDebug();
    await acceptCookies();
    await setProps(props);
    await t.navigateTo(tripUrl);
  });

test('Traveler details page is displayed in Responsive flow', async () => {
  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(Selector('#rf-metaentry, #rf-travelerModule').exists).ok();
});
