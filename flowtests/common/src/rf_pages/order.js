import { t } from 'testcafe';
import orderModule from '../rf_modules/orderModule';

export const messageSupersaverSe = 'Din bokning är bekräftad och betald!';
export const messageUk = 'Your booking is confirmed and paid for!';

export async function goToPostbookingFromOrderPage() {
  await t.click(orderModule.seeAllProductsButton);
}

export async function waitForOrderPageToLoad() {
  await t.expect(orderModule.orderPage.visible).ok('', { timeout: 90000 });
}
