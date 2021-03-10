/* eslint-disable no-await-in-loop */
import { Selector, t } from 'testcafe';
import seatMapModule from '../rf_modules/seatMapModule';
import { getSelectorAttribute } from '../util/common';
import { scrollToElement } from '../util/clientFunction';

export async function clickSeatMapYes() {
  await t.click(seatMapModule.productYesButton);
}

export async function closeSeatMapModal() {
  await t.click(seatMapModule.closeButton);
  await t.click(seatMapModule.verifyCloseSeatMap);
}

export async function getNumberOfTravelers() {
  return Selector(seatMapModule.seatMapTravelerInfo).count;
}

export async function getNumberOfLegs() {
  return Selector(seatMapModule.stepIdicatorButton).count;
}

export async function saveSeatMapSelections() {
  let numberOfSeatsBooked;
  await t.click(seatMapModule.saveAndContinueButton);
  if (await seatMapModule.seatMapSummary.exists) {
    numberOfSeatsBooked = await seatMapModule.editSeatButton.count;
    await t.click(seatMapModule.saveAndContinueButton);
  }
  return numberOfSeatsBooked;
}

export async function selectSeatsForAllSegmentTypes() {
  const numberOfLegs = await getNumberOfLegs();
  for (let j = 0; j < numberOfLegs; j += 1) {
    const segmentType = await getSelectorAttribute(
      '[data-testid^="seatMap-segment-"]',
      'data-testid',
      j,
    );
    switch (segmentType) {
      case 'seatMap-segment-available-type-SellSeatingPreference':
        await t.click(seatMapModule.seatingPreferenceOptions.nth(0));
        break;
      case 'seatMap-segment-available-type-SellSeatingBeside':
        if (await seatMapModule.seatingLightOptions.exists) {
          await t.click(seatMapModule.seatingLightOptions.nth(0));
        }
        if (await seatMapModule.seatingBesideOption.exists) {
          await t.click(seatMapModule.seatingBesideOption.nth(0));
        }
        break;
      case 'seatMap-segment-unavailable':
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const numberOfTravelers = await getNumberOfTravelers();
        for (let i = 0; i < numberOfTravelers; i += 1) {
          if (await seatMapModule.travelerSeat(i).exists) {
            await t.click(seatMapModule.travelerSeat(i));
          }
        }
        break;
    }
    const isLastSegment = numberOfLegs === j + 1;
    if (!isLastSegment) {
      const nextSegmentButton = seatMapModule.segmentTab(j + 1);
      await t.click(nextSegmentButton).wait(1000);
    }
  }
}

export async function selectSeatsAndSeatingPreference() {
  await clickSeatMapYes();
  await selectSeatsForAllSegmentTypes();
  await t.click(seatMapModule.saveAndContinueButton).click(seatMapModule.saveAndContinueButton);
}

export async function selectSeatsAndVerifyNotIncludeInfants(numberOfSegments) {
  await scrollToElement('[data-testid="seatMap-container"]');
  await clickSeatMapYes();
  await selectSeatsForAllSegmentTypes();
  const numberOfSeats = await saveSeatMapSelections();
  await t.expect(numberOfSeats).eql(numberOfSegments);
}
