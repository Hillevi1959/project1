/* eslint-disable no-console */
import { t } from 'testcafe';
import enableDebug from '../../../common/src/util/debug';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner } from '../../../common/src/rf_pages/start';
import config from '../../../frontE2E/testdata.json';
import { getDiscountCode, getDiscountCodeUrl } from '../../../common/src/rf_pages/edvin';
import { getWindowWidth } from '../../../common/src/util/device';
import {
  prepareSelfServiceRebookingFlow,
  createOrderAndDiscountCode,
} from '../../../common/src/util/selfServiceReboking';

const url = getSiteUrl('gotogate-uk', config.host);
const props = {
  'PaymentService.CascadingPaymentsBehavior.Enabled': false,
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'Result.SelfServiceRebooking.ValidWithVoucherTag.Enable': true,
  'Result.SelfServiceRebooking.ValidWithVoucherSwitch.Enable': true,
};
const dummyPaymentFalse = false;

fixture('Verify self service rebooking flow semi automated')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await selectProvider('Sabre');
    await setProps(props);
    await acceptCookies();
    await closeHeaderUrgencyBanner();
  });
/*
  To make this test run without errors after first deploy, an order search needs to be done manually in Edvin
  or run this test:
  testcafe "chrome" flowtests/frontE2E/src/tests/*Test.js -e -q -t 'Edvin warm up' --disable-multiple-windows

  To start this test in terminal:
 testcafe "chrome" flowtests/semi-automated/src/tests/*.js -e -t 'Create order in self service rebooking flow semi automated' --disable-multiple-windows
 */
test('Create order in self service rebooking flow semi automated', async () => {
  if ((await getWindowWidth()) < 970) {
    // eslint-disable-next-line no-console
    console.warn('This test is not run on mobile or tablet device');
  } else {
    await createOrderAndDiscountCode('https://gotogate-uk', 'gotogate-uk-edvin', dummyPaymentFalse);
    console.log('Voucher code: ', getDiscountCode());
    console.log('Voucher url: ', getDiscountCodeUrl());
    await prepareSelfServiceRebookingFlow(url);
    await t.debug();
  }
});
