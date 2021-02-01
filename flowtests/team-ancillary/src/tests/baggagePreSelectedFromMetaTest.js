import { t } from 'testcafe';
import { getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { getTrip, getTripBaggageIncluded } from '../util/metaTrips';

import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import config from './testdata.json';

const url = getSiteUrl('SE-meta', config.host);
const props = {
  'Feature.NewResponsive.Enabled': true,
};

fixture('Meta trips in Responsive flow included checked baggage')
  .page(url)
  .beforeEach(async () => {
    await enableDebug(false);
    await setProps(props);
  });

test.skip('Traveler details page is displayed in Responsive flow included checked baggage', async () => {
  const offerUrl = await getTrip(url);
  console.log(`offerUrl: ${offerUrl}`);
  await t.navigateTo(`${offerUrl}&baggageIncluded=1`);
  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(travelerModule.checkInBaggageIcon.exists).ok();
});

test.skip('Traveler details page is displayed in Responsive flow included checked baggage free of charge', async () => {
  const offerUrl = await getTripBaggageIncluded(url);
  console.log(`offerUrl: ${offerUrl}`);
  await t.navigateTo(`${offerUrl}&baggageIncluded=1`);
  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(travelerModule.checkInBaggageContainer.exists).ok();
});
