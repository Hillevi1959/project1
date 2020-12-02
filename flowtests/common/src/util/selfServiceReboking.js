/* eslint-disable no-console */
import { t } from 'testcafe';
import { createVoucherInEdvin, getDiscountCodeUrl } from '../rf_pages/edvin';
import config from '../../../frontE2E/testdata.json';
import { makeSearch, selectTravelers } from '../rf_pages/start';
import resultModule from '../rf_modules/resultModule';
import { selectTripNumber } from '../rf_pages/result';
import { addTravelerInformation, bookFlight } from '../rf_pages/travelerDetails';
import { addNoExtraProducts } from '../rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../rf_pages/seatMap';
import { acceptPriceChange, payWithCreditCard, payWithDummyBank } from '../rf_pages/payment';
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
import { getSiteUrl } from './common';
import enableDebug from './debug';

export async function prepareSelfServiceRebookingFlow(url) {
  await t.navigateTo(url);
  await enableDebug();
  await t.navigateTo(getDiscountCodeUrl());
  console.log('Go to SSR start page');
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
  const origin = 'Mauritius';
  const destination = 'New Delhi';
  // const site = 'https://gotogate-uk';

  await selectTravelers(numberOfAdults, numberOfChildren, numberOfInfants);
  console.log('Search for trip');
  await makeSearch('one way trip', origin, destination, 10);
  await t.expect(resultModule.toggleFilterButton.visible).ok('', { timeout: 20000 });
  await scrollToElement('[data-testid="resultPage-toggleFiltersButton-button"]');
  await t
    .click(resultModule.toggleFilterButton)
    .click(resultModule.clearAirlines)
    .click(resultModule.filterAirlineMauritiusCheckbox)
    .click(resultModule.toggleFilterButton);
  await selectTripNumber(0);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();
  if (paymentServiceProvider) {
    await payWithDummyBank(travelers[0]);
  } else {
    await payWithCreditCard();
  }
  await acceptPriceChange();
  await waitForOrderPageToLoad();
  const orderNumber = await orderModule.orderNumber.innerText;
  console.log('Order number: ', orderNumber);
  await t.navigateTo(`${urlEdvin}/order/Order.list.action?_s=true&searching=true`);
  if (await edvinModule.userNameInput.visible) {
    await t
      .typeText(edvinModule.userNameInput, 'autotest')
      .typeText(edvinModule.passwordInput, 'gurkburk')
      .click(edvinModule.logInButton);
  }
  await createVoucherInEdvin(site, orderNumber);
}
