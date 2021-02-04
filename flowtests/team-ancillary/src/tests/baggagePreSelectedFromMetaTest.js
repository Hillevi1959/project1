import { t } from 'testcafe';
import { getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { getTrip, getTripBaggageIncluded } from '../util/metaTrips';

import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import config from './testdata.json';

const url = getSiteUrl('SE-meta', config.host);
const props = {
  'Feature.NewResponsive.Enabled': true,
};

fixture('Checked baggage preselected from meta')
  .page(url)
  .beforeEach(async () => {
    await enableDebug(false);
    await setProps(props);
  });

test('Checked baggage preselected from meta, added to cart on traveler details', async () => {
  const offerUrl = await getTrip(url);
  console.log(`offerUrl: ${offerUrl}`);
  await t.navigateTo(`${offerUrl}&baggageIncluded=1`);

  await t.expect(resultModule.searchForm.exists).ok('', { timeout: 50000 });
  await selectTripButtonByIndex(0);

  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(travelerModule.checkInBaggageIcon.exists).ok();
});

test('Baggage preselected from meta, included checked baggage free of charge displayed on traveler details', async () => {
  const offerUrl = await getTripBaggageIncluded(url);
  console.log(`offerUrl: ${offerUrl}`);
  await t.navigateTo(`${offerUrl}&baggageIncluded=1`);

  await t.expect(resultModule.searchForm.exists).ok('', { timeout: 50000 });
  await selectTripButtonByIndex(0);

  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(travelerModule.checkInBaggageContainer.exists).ok();
});
