/* eslint-disable no-await-in-loop */
import { Selector, t } from 'testcafe';
import config from '../../../frontE2E/testdata.json';
import edvinModule from '../rf_modules/edvinModule';
import { getCurrentUrl } from '../util/clientFunction';
import { getSiteUrl } from '../util/common';

let discountCodeLinkResponsive = '';
let discountCode = '';

export async function checkForDiscountCodes() {
  await t
    .navigateTo(
      `http://test-uk${config.host}/edvin/discount/DiscountItem.list.action?discountCampaignId=3355&_s=true`,
    )
    .typeText(edvinModule.userNameInput, 'autotest')
    .typeText(edvinModule.passwordInput, 'gurkburk')
    .click(edvinModule.logInButton);
  // Check if discount items exists and check number of items left
  if ((await edvinModule.numberOfDiscountRows.count) > 1) {
    await t.click(Selector('tr.odd').nth(1));
    const numberDiscountLeft = parseInt(
      await Selector('[name="numUsagesLeft"]').getAttribute('value'),
      10,
    );
    // eslint-disable-next-line no-console
    console.log('Number of discounts left: ', numberDiscountLeft);
    if (numberDiscountLeft < 1) {
      await t
        .click(edvinModule.numberOfCodesLeft)
        .pressKey('ctrl+a delete')
        .typeText(edvinModule.numberOfCodesLeft, '20');
      await t.click(edvinModule.submitButton);
    }
  } else {
    // Create discount item
    await t.navigateTo(
      `http://test-uk${config.host}/edvin/discount/DiscountGenerateCode.edit.action?_s=true&codeGenerationConfigType=PUBLIC_CODE&discountCampaignId=3355`,
    );
    await t.typeText(edvinModule.codeName, 'TESTDISCOUNTCODE');
    await t
      .click(edvinModule.nuberOfCodes)
      .pressKey('ctrl+a delete')
      .typeText(edvinModule.nuberOfCodes, '20');
    await t.click(edvinModule.submitButton);
  }
}

export async function convertUrl(site, url) {
  const urlWithSite = site.concat(url);
  const originUrl = await getCurrentUrl();
  const id = originUrl.split('3D').pop();
  return urlWithSite.concat(id);
}

export async function generateReceiptFromEdvin(orderNumber) {
  await t.navigateTo(
    `http://supersaver-se${config.host}/edvin/order/Order.list.action?_s=true&searching=true`,
  );
  await t
    .typeText(edvinModule.userNameInput, 'autotest')
    .typeText(edvinModule.passwordInput, 'gurkburk')
    .click(edvinModule.logInButton);
  await t
    .click(edvinModule.orderNumberInput)
    .typeText(edvinModule.orderNumberInput, orderNumber)
    .click(edvinModule.submitButton);
  const orderUlrWithId = await convertUrl(
    'http://supersaver-se',
    `${config.host}/edvin/core/order/OrderContainer.edit.action?_s=true&id=`,
  );
  await t
    .navigateTo(orderUlrWithId)
    .click(edvinModule.messageList)
    .click(edvinModule.messageListOption.withText('Generate Receipt'));
}

function setDiscountCodeUrl(url) {
  discountCodeLinkResponsive = url;
}

export function getDiscountCodeUrl() {
  return discountCodeLinkResponsive;
}

function setDiscountCode(code) {
  discountCode = code;
}

export function getDiscountCode() {
  return discountCode;
}

export async function createVoucherInEdvin(site, orderNumber) {
  do {
    await t.navigateTo(
      `${site}${config.host}/edvin/order/Order.list.action?_s=true&searching=true`,
    );
    let currentUrl = await getCurrentUrl();
    if (!currentUrl.includes('edvin/gui/?url=/edvin/core/order/OrderContainer.edit.action%3Fid')) {
      await t.expect(edvinModule.orderNumberInput.visible).ok();
      await t
        .click(edvinModule.orderNumberInput)
        .typeText(edvinModule.orderNumberInput, orderNumber)
        .click(edvinModule.submitButton);
    }
    let orderUlrWithId = await convertUrl(
      site,
      `${config.host}/edvin/core/order/OrderContainer.edit.action?_s=true&id=`,
    );
    if (await Selector('.alert.alert-info').visible) {
      await t.click(Selector('.edvin-menu.edvin-menu-left'));
      await t.navigateTo(
        `${site}${config.host}/edvin/order/Order.list.action?_s=true&searching=true`,
      );
      currentUrl = await getCurrentUrl();
      if (
        !currentUrl.includes('edvin/gui/?url=/edvin/core/order/OrderContainer.edit.action%3Fid')
      ) {
        await t.expect(edvinModule.orderNumberInput.visible).ok();
        await t
          .click(edvinModule.orderNumberInput)
          .typeText(edvinModule.orderNumberInput, orderNumber)
          .click(edvinModule.submitButton);
        orderUlrWithId = await convertUrl(
          site,
          `${config.host}/edvin/core/order/OrderContainer.edit.action?_s=true&id=`,
        );
      }
    }
    await t.navigateTo(orderUlrWithId);
  } while (!(await edvinModule.providerBookingIdLink.visible));

  await t.click(edvinModule.providerBookingIdLink);
  const providerBookingUrlWithId = await convertUrl(
    site,
    `${config.host}/edvin/core/booking/ProviderBooking.edit.action?_s=true&id=`,
  );
  await t.navigateTo(providerBookingUrlWithId);
  await t.click(edvinModule.realDiscountGeneratorButton);
  await t.navigateTo(providerBookingUrlWithId);
  await t.click(edvinModule.discountItemLink);
  const discountUrlWithId = await convertUrl(
    site,
    `${config.host}/edvin/discount/DiscountItem.edit.action?_s=true&id=`,
  );
  await t.navigateTo(discountUrlWithId);
  setDiscountCode(await edvinModule.discountCodeField.getAttribute('value'));
  setDiscountCodeUrl(await edvinModule.discountLinkResponsive.getAttribute('href'));
}

export async function searchFirstOrderInEdvin() {
  const urlEdvin = getSiteUrl('gotogate-uk-edvin', config.host);
  await t.navigateTo(`${urlEdvin}/order/Order.list.action?_s=true&searching=true`);
  await t
    .typeText(edvinModule.userNameInput, 'autotest')
    .typeText(edvinModule.passwordInput, 'gurkburk')
    .click(edvinModule.logInButton);
  const currentUrl = await getCurrentUrl();
  if (!currentUrl.includes('edvin/gui/?url=/edvin/core/order/OrderContainer.edit.action%3Fid')) {
    await t
      .click(edvinModule.orderSearchDatePicker)
      .click(edvinModule.orderSearchPreviousMonth)
      .click(edvinModule.orderSearchDoneDateButton)
      .click(edvinModule.orderNumberInput)
      .typeText(edvinModule.orderNumberInput, 'L');
    await t.click(edvinModule.submitButton);
    const orderNumber = await edvinModule.firstOrderNumberInResultTable.innerText;
    console.log('Searched order number: ', await orderNumber);
    await t.expect(edvinModule.orderNumberInput.visible).ok('', { timeout: 20000 });
    await t
      .click(edvinModule.orderNumberInput)
      .typeText(edvinModule.orderNumberInput, await orderNumber)
      .click(edvinModule.submitButton);
  }
}
