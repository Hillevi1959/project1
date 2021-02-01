import { t } from 'testcafe';
import { getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import setProps from '../../../common/src/util/props';
import { getTripFlexTicket } from '../util/metaTrips';
import travelerModule from '../../../common/src/rf_modules/travelerDetailsModule';
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

test.skip('Traveler details page is displayed in Responsive flow included flexticket', async () => {
  await t.expect(travelerModule.travelerDetailsForm.exists).ok('', { timeout: 50000 });
  await t.expect(travelerModule.flexibleTicketIcon.exists).ok();
});
