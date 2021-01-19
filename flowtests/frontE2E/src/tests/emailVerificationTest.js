/* eslint-disable no-await-in-loop */
import { t } from 'testcafe';
import { acceptCookies, clearField, getSiteUrl } from '../../../common/src/util/common';
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

test('Syntactic and domain validaton of email', async () => {
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'NYO', 'LON', 'ECONOMY', [11, 24]);
  await t.expect(travelerDetailsModule.contactPersonMail.visible).ok();
  await scrollToElement('[for="traveler-mail"]');
  await t.typeText(travelerDetailsModule.contactPersonMail, 'dev.test@gmail.com.');
  await t.typeText(travelerDetailsModule.contactPersonPhone, travelers[0].phone);

  await t.expect(travelerDetailsModule.errorMessage.nth(0).visible).ok();
  await t
    .expect(travelerDetailsModule.errorMessage.nth(0).innerText)
    .contains('Invalid email, allowed characters:');

  await clearField(travelerDetailsModule.contactPersonMail);
  await t.typeText(travelerDetailsModule.contactPersonMail, 'dev.test@gmial.com');
  await t.click(travelerDetailsModule.contactPersonPhone);

  await t
    .expect(travelerDetailsModule.errorMessage.nth(0).innerText)
    .contains('Please take an extra look at your email address. gmial.com');

  await clearField(travelerDetailsModule.contactPersonMail);
  await t.typeText(travelerDetailsModule.contactPersonMail, travelers[0].email);
  await t.click(travelerDetailsModule.contactPersonPhone);

  await t.expect(travelerDetailsModule.errorMessage.nth(0).exists).notOk();
});
