import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import { closeHeaderUrgencyBanner, searchTrip } from '../../../common/src/rf_pages/start';
import config from '../../testdata.json';
import debugModule from '../../../common/src/rf_modules/debugModule';
import resultModule from '../../../common/src/rf_modules/resultModule';

const url = getSiteUrl('gotogate-uk', config.host);
const numberOfAdults = 2;

fixture('Debug client verification')
  .page(url)
  .beforeEach(async () => {
    await acceptCookies();
    await closeHeaderUrgencyBanner();
  });

test('Verify debug client can be used', async () => {
  await t.expect(debugModule.enableDebug.innerText).contains('Enable');
  await t.click(debugModule.enableDebug);
  await t.expect(debugModule.enableDebug.innerText).contains('Disable');

  await t.expect(debugModule.debugToolsButton.visible).ok();
  await t.expect(debugModule.debugOptionsButton.visible).ok();

  await t.click(debugModule.debugToolsButton);
  await t.expect(debugModule.debugBarOpen.count).eql(1);
  await t.click(debugModule.debugToolsButton);
  await t.expect(debugModule.debugBarClosed.count).eql(2);

  await t.click(debugModule.debugOptionsButton);
  await t.expect(debugModule.debugBarOpen.count).eql(1);
  await t.click(debugModule.debugOptionsButton);
  await t.expect(debugModule.debugBarClosed.count).eql(2);

  await selectProvider('IbeGDSDummy');
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'AMS', 'ECONOMY', [11, 24]);

  await t.expect(resultModule.resultPage.visible).ok();
  await t.expect(debugModule.debugFilterButton.visible).ok();

  await t.click(debugModule.debugFilterButton);
  await t.expect(debugModule.debugBarOpen.count).eql(1);
  await t.click(debugModule.debugFilterButton);
  await t.expect(debugModule.debugBarClosed.count).eql(3);

  await t.click(debugModule.enableDebug);
  await t.expect(debugModule.enableDebug.innerText).contains('Enable');
});
