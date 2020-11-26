/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Selector, t } from 'testcafe';
import { getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import edvinModule from '../../../common/src/rf_modules/edvinModule';
import { getCurrentUrl } from '../../../common/src/util/clientFunction';
import { convertUrl } from '../../../common/src/rf_pages/edvin';

const urlEdvin = getSiteUrl('gotogate-uk-edvin', config.host);

fixture('Edvin warm up searching for order').beforeEach(async () => {
  // eslint-disable-next-line no-console
  console.log('Edvin warm up started');
});

test('Edvin warm up', async () => {
  let i = 1;
  do {
    await t.navigateTo(`${urlEdvin}/order/Order.list.action?_s=true&searching=true`);
    if (await edvinModule.userNameInput.visible) {
      await t
        .typeText(edvinModule.userNameInput, 'autotest')
        .typeText(edvinModule.passwordInput, 'gurkburk')
        .click(edvinModule.logInButton);
    }
    const currentUrl = await getCurrentUrl();
    if (!currentUrl.includes('edvin/gui/?url=/edvin/core/order/OrderContainer.edit.action%3Fid')) {
      await t
        .click(edvinModule.orderSearchDatePicker)
        .click(edvinModule.orderSearchPreviousMonth)
        .click(edvinModule.orderSearchDoneDateButton)
        .click(edvinModule.orderNumberInput)
        .typeText(edvinModule.orderNumberInput, 'L');
      await t.click(edvinModule.submitButton);
      await t.click(Selector(`.resultSet:nth-child(2) tbody tr:nth-child(${i}) td:nth-child(4) a`));
      const orderUrl = await convertUrl(
        'https://gotogate-uk',
        `${config.host}/edvin/core/order/OrderContainer.edit.action?_s=true&id=`,
      );
      await t.navigateTo(orderUrl);
      console.log('Edvin warm up completed nr ', i);
      i += 1;
    }
  } while (i < 4);
});
