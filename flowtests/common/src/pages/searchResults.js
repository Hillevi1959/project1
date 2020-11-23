import { t } from 'testcafe';
import search from '../modules/searchResultModules';

export async function selectFirstTripDesktop() {
  await search.bookFlightButton.with({ visibilityCheck: true })();
  await t.expect(search.bookFlightButton.visible).ok();
  await t.click(search.bookFlightButton);
}

export async function selectViTripDesktop() {
  await search.bookFlightButton.with({ visibilityCheck: true })();
  await t.expect(search.bookFlightButton.visible).ok();
  await t
    .expect(search.infoTextViTrip.nth(1).innerText)
    .contains('Obs! Resan består av flera separata biljetter');
  await t.click(search.bookFlightButton.nth(1));
}
