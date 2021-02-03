import { t } from 'testcafe';
import { getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { getTripFlexTicket } from '../util/metaTrips';
import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
import resultModule from '../../../common/src/rf_modules/resultModule';
import config from './testdata.json';

const url = getSiteUrl('SE-meta', config.host);
const props = {
  'Feature.NewResponsive.Enabled': true,
};

fixture('Flex ticket preselected from meta')
  .page(url)
  .beforeEach(async () => {
    const offerUrl = await getTripFlexTicket(url);
    console.log(`offerUrl: ${offerUrl}`);
    await enableDebug(false);
    await setProps(props);
    await t.navigateTo(`${offerUrl}&flexticket=1`);
  });

test('Flex ticket preselected from meta added to cart on traveler details', async () => {
  await t.expect(resultModule.searchForm.exists).ok('', { timeout: 50000 });
  await t.click(resultModule.bookFlightButton);

  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(travelerModule.flexibleTicketIcon.exists).ok();
});
