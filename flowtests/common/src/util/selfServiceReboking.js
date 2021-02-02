/* eslint-disable no-console */
import { Selector, t } from 'testcafe';
import { createVoucherInEdvin, getDiscountCodeUrl, logInToEdvin } from '../rf_pages/edvin';
import config from '../../../frontE2E/testdata.json';
import { makeSearch, selectTravelers } from '../rf_pages/start';
import resultModule from '../rf_modules/resultModule';
import { selectTripButtonByIndex } from '../rf_pages/result';
import { addTravelerInformation, bookFlight } from '../rf_pages/travelerDetails';
import { addNoExtraProducts } from '../rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../rf_pages/seatMap';
import { payWithCreditCard, payWithDummyBank } from '../rf_pages/payment';
import { waitForOrderPageToLoad } from '../rf_pages/order';
import orderModule from '../rf_modules/orderModule';
import edvinModule from '../rf_modules/edvinModule';
import { scrollToElement } from './clientFunction';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
  getSecondAdult,
} from './travelerData';
import { clearField, getSiteUrl } from './common';
import enableDebug from './debug';

export async function updateDiscountCampaignForCovid19() {
  const urlEdvin = getSiteUrl('gotogate-uk-edvin', config.host);
  const propInList = Selector('.resultSet:nth-child(2) td a').withText('MK issued before 31mar20');
  const tabUsageCriteria = Selector('[title="Usage criteria"]');
  const validatingCarriersInput = Selector(
    '[name="discountCriterionWrapper.validatingCarrierIataCodeList"]',
  );
  const saveButton = Selector('[name="__submit"]').nth(0);

  await logInToEdvin(urlEdvin);
  await t.navigateTo(
    `${urlEdvin}/discount/DiscountCampaign.list.action?displaySiteId=&displayDiscountCampaignTypeId=7&namePattern=&__checkbox_showHidden=true&__checkbox_showExpired=true&createdStart=&createdEnd=&periodStart=&periodEnd=&_s=true&searching=true&extended=false`,
  );
  await t.click(propInList);
  await t.navigateTo(`${urlEdvin}/discount/DiscountCampaignCovid19.edit.action?_s=true&id=3386`);
  await t.click(tabUsageCriteria);
  await clearField(validatingCarriersInput);
  await t.click(saveButton);
}

export async function prepareSelfServiceRebookingFlow(url) {
  await t.navigateTo(url);
  await enableDebug();
  await t.navigateTo(getDiscountCodeUrl());
  console.log('Navigate to SSR start page');
}

export async function createOrderAndDiscountCode(site, siteEdvin, paymentServiceProvider) {
  const urlEdvin = getSiteUrl(siteEdvin, config.host);
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const numberOfAdults = 2;
  const numberOfChildren = 1;
  const numberOfInfants = 1;
  const origin = 'Stockholm';
  const destination = 'London';

  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  console.log('Search for trip');
  await makeSearch('one way trip', origin, destination, [11]);
  await t.expect(resultModule.toggleFilterButton.visible).ok('', { timeout: 20000 });
  await scrollToElement('[data-testid="resultPage-toggleFiltersButton-button"]');
  await t
    .click(resultModule.toggleFilterButton)
    .click(resultModule.clearAirlines)
    .click(resultModule.filterAirlineSasCheckbox)
    .click(resultModule.toggleFilterButton);
  await selectTripButtonByIndex(0);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();
  if (paymentServiceProvider) {
    await payWithDummyBank();
  } else {
    await payWithCreditCard();
  }
  await waitForOrderPageToLoad();
  const orderNumber = await orderModule.orderNumber.innerText;
  await t.navigateTo(`${urlEdvin}/order/Order.list.action?_s=true&searching=true`);
  if (await edvinModule.userNameInput.visible) {
    await t
      .typeText(edvinModule.userNameInput, 'autotest')
      .typeText(edvinModule.passwordInput, 'gurkburk')
      .click(edvinModule.logInButton);
  }
  await createVoucherInEdvin(site, orderNumber);
}
