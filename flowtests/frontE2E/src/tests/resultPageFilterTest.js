/* eslint-disable no-await-in-loop */

import { t } from 'testcafe';
import { acceptCookies, getNumberOfElements, getSiteUrl } from '../../../common/src/util/common';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import {
  closeHeaderUrgencyBanner,
  makeSearch,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import resultModule from '../../../common/src/rf_modules/resultModule';
import config from '../../testdata.json';
import {
  convertPricePound,
  convertTimeStampToFloat,
  convertTimeToFloat,
} from '../../../common/src/rf_pages/result';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';

const url = getSiteUrl('gotogate-uk', config.host);
const numberOfAdults = 1;

async function searchForTrip() {
  await selectTravelers(numberOfAdults, 0, 0);
  await makeSearch('return trip', 'STO', 'BER', 10);
}

fixture(`Verify filter feature on result page`)
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await selectProvider('IbeGDSDummy');
    await selectProvider('IbeDummy');
    await closeHeaderUrgencyBanner();
    await searchForTrip();
    await t.click(resultModule.toggleFilterButton);
  });

test('Verify filtering trips with no, one and all stops', async () => {
  let numberOfStops = 0;
  if (await isMobile()) {
    await t.click(resultModule.filterMaxStopToggleButton);
  }
  await t.click(resultModule.filterDirectButton);
  await t.expect(await resultModule.tripChange.count).eql(numberOfStops);

  numberOfStops = 2;
  const { count } = resultModule.tripChange;
  await t.click(resultModule.filterMaxOneStopButton);
  for (let i = 0; i < (await count); i += 1) {
    await t.expect(parseInt(await resultModule.tripChange.nth(i).innerText, 10)).lt(numberOfStops);
  }

  numberOfStops = 4;
  await t.click(resultModule.filterAllButton);
  for (let i = 0; i < (await count); i += 1) {
    await t.expect(parseInt(await resultModule.tripChange.nth(i).innerText, 10)).lt(numberOfStops);
  }
});

test('Filter trips with total time, trip price or air line', async () => {
  // Filter with total time
  let time = 0;
  if (await isMobile()) {
    await t.click(resultModule.filterTravelTimeToggleButton);
    await t.drag(resultModule.filterTravelTimeSlider, -217, 0); // 21 h
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.drag(resultModule.filterTravelTimeSlider, -340, 0); // 21 h
  }
  const countTime = await getNumberOfElements('[data-testid="searchResults-segment-duration"]');
  for (let i = 0; i < (await countTime); i += 1) {
    time = convertTimeToFloat(await resultModule.travelTimeDuration.nth(i).innerText);
    await t.expect(time).lte(21);
  }
  await t.click(resultModule.filterResetButton);

  // Filter with standard price, price with flexible ticket not included
  let price = 0;
  if (await isMobile()) {
    await t.click(resultModule.filterPriceToggleButton);
    await t.drag(resultModule.filterPriceSliderRight, -240, 0); // 4010
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.drag(resultModule.filterPriceSliderRight, -389, 0); // 4003
  }
  const displayedMaxPrice = convertPricePound(await resultModule.filterPriceMaxLabel.innerText);

  const countPrice = await getNumberOfElements('[data-testid="result-bookButtons-wrapper"]');
  for (let i = 0; i < (await countPrice); i += 1) {
    price = convertPricePound(await resultModule.tripPriceStandard.nth(i).innerText);
    await t.expect(price).lte(displayedMaxPrice);
  }
  await t.click(resultModule.filterResetButton);

  //  Filter with air line
  if (await isMobile()) {
    await t.click(resultModule.filterAirlineToggleButton);
  }
  await t.click(resultModule.filterAirlineLufthansaCheckbox);
  const countAir = await getNumberOfElements('[data-testid="tripDetails-segment"]');
  for (let i = 0; i < (await countAir); i += 1) {
    await t.expect(resultModule.tripSegment.nth(i).innerText).notContains('Lufthansa');
  }
});

test('Filter trips with departure and arrival time', async () => {
  const { count } = resultModule.tripSegment;
  if (await isMobile()) {
    await t.click(resultModule.filterDepArrFirstBoundToggleButton);
    await t.drag(resultModule.filterDepartureFirstBoundLeftSlider, 120, 0); // 9:00
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.drag(resultModule.filterDepartureFirstBoundLeftSlider, 195, 0); // 9:00
  }
  if (await isMobile()) {
    await t.click(resultModule.filterDepArrSecondBoundToggleButton);
    await t.click(resultModule.filterArrivalSecondBoundRadioButton);
    await t.drag(resultModule.filterArrivalSecondBoundRightSlider, -190, 0); // 10:00
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.click(resultModule.filterArrivalSecondBoundRadioButton);
    await t.drag(resultModule.filterArrivalSecondBoundRightSlider, -300, 0); // 10:00
  }
  const departureTime = convertTimeStampToFloat(
    await resultModule.filterDepartureTimeFirstBound.nextSibling().innerText,
  );
  const arrivalTime = convertTimeStampToFloat(
    await resultModule.filterArrivalTimeSecondBound.nextSibling(1).innerText,
  );

  for (let i = 0; i < (await count); i += 2) {
    const timeConverted = convertTimeStampToFloat(
      await resultModule.timeStampSegmentOrigin.nth(i).innerText,
    );
    await t.expect(timeConverted).gte(departureTime);
  }

  for (let i = 1; i < (await count); i += 2) {
    const timeConverted = convertTimeStampToFloat(
      await resultModule.timeStampSegmentDestination.nth(i).innerText,
    );
    await t.expect(timeConverted).lte(arrivalTime);
  }
});
