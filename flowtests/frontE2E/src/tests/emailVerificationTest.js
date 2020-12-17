import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const url = getSiteUrl('gotogate-uk', config.host);
const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);
const props = {
  'Payment.FraudAssessment.Accertify.ShadowMode': true,
  'Payment.provider.creditcard': 'adyen',
  'EmailValidation.RegEx.Enabled': true,
  'EmailValidation.MX.Enabled': true,
};
const numberOfAdults = 2;

fixture('Email format verification on TD-page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Syntatic and domain validaton of email', async () => {
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'NYO', 'LON');

  await t.expect(travelerDetailsModule.contactPersonMail.exists).ok('', { timeout: 30000 });
  await scrollToElement('[for="traveler-mail"]');
  await t.typeText(travelerDetailsModule.contactPersonMail, 'dev.test@com.');
  await t.debug();
});
