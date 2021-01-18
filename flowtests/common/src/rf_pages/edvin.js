/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Selector, t } from 'testcafe';
import config from '../../../frontE2E/testdata.json';
import edvinModule from '../rf_modules/edvinModule';
import { getCurrentUrl, navigateToUrl } from '../util/clientFunction';

let discountCodeLinkResponsive = '';
let discountCode = '';

export async function logInToEdvin(url) {
  await t
    .navigateTo(url)
    .typeText(edvinModule.userNameInput, 'autotest')
    .typeText(edvinModule.passwordInput, 'gurkburk')
    .click(edvinModule.logInButton);
}

export async function setPriceOnproduct(price, productText) {
  await t.navigateTo(`https://test-uk${config.host}/edvin/product/Product.list.action?_s=true`);
  await t
    .click(edvinModule.product.withText(productText))
    .click(edvinModule.productPrice)
    .pressKey('ctrl+a delete')
    .typeText(edvinModule.productPrice, price)
    .click(edvinModule.saveProductButton);
}

export async function checkForDiscountCodes(campaignId, discountName) {
  await logInToEdvin(`http://test-uk${config.host}/edvin/login.action`);
  await t.navigateTo(
    `http://test-uk${config.host}/edvin/discount/DiscountItem.list.action?discountCampaignId=${campaignId}&_s=true`,
  );

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
      `http://test-uk${config.host}/edvin/discount/DiscountGenerateCode.edit.action?_s=true&codeGenerationConfigType=PUBLIC_CODE&discountCampaignId=${campaignId}`,
    );
    await t.typeText(edvinModule.codeName, discountName);
    await t
      .click(edvinModule.numberOfCodes)
      .pressKey('ctrl+a delete')
      .typeText(edvinModule.numberOfCodes, '20');
    await t.click(edvinModule.submitButton);
  }
}

export async function convertUrl(site, url) {
  const urlWithSite = site.concat(url);
  const originUrl = await getCurrentUrl();
  const id = originUrl.split('3D').pop();
  return urlWithSite.concat(id);
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

export async function searchOrder(site, orderNumber) {
  await t.navigateTo(`${site}${config.host}/edvin/order/Order.list.action?_s=true&searching=true`);
  const currentUrl = await getCurrentUrl();
  if (!currentUrl.includes('edvin/gui/?url=/edvin/core/order/OrderContainer.edit.action%3Fid')) {
    await t.expect(edvinModule.orderNumberInput.visible).ok();
    await t.click(edvinModule.orderNumberInput).typeText(edvinModule.orderNumberInput, orderNumber);
    await t.click(edvinModule.submitButton);
    console.log('Search for order: ', orderNumber);
  }
  return convertUrl(site, `${config.host}/edvin/core/order/OrderContainer.edit.action?_s=true&id=`);
}

export async function createVoucherInEdvin(site, orderNumber) {
  let iteration = 0;
  do {
    let orderUrlWithId = await searchOrder(site, orderNumber);

    if (await Selector('.alert.alert-info', { timeout: 1000 }).visible) {
      await t.click(Selector('.edvin-menu.edvin-menu-left'));
      orderUrlWithId = searchOrder(site, orderNumber);
    }
    await navigateToUrl(orderUrlWithId);
    iteration += 1;
  } while (!(await edvinModule.providerBookingIdLink.visible) && iteration < 20);

  await t.click(edvinModule.providerBookingIdLink);
  const providerBookingUrlWithId = await convertUrl(
    site,
    `${config.host}/edvin/core/booking/ProviderBooking.edit.action?_s=true&id=`,
  );
  await t.navigateTo(providerBookingUrlWithId);
  await t.click(edvinModule.dummyDiscountGeneratorButton);
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
