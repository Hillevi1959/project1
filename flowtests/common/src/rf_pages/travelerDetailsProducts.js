/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
import { t } from 'testcafe';
import { scrollToElement } from '../util/clientFunction';
import travelerDetailsModule from '../rf_modules/travelerDetailsModule';
import { dropdownSelect } from '../util/dropdownSelect';
import { isDesktop, isMobile, isTablet } from '../util/device';
import { getDateOfBirth } from '../util/common';
import { getPriceFromText } from '../util/price';
import { saveSeatMapSelections, selectSeatsForAllSegmentTypes } from './seatMap';

export async function addSupportPackageBasic() {
  if (await isMobile()) {
    await scrollToElement('[for="toggleChoice.supportPackage.0"]');
    await t.click(travelerDetailsModule.supportPackageBasicMobile);
    if (await travelerDetailsModule.supportPackageModalNoButton.exists) {
      await t.click(travelerDetailsModule.supportPackageModalNoButton);
    }
  } else if ((await isTablet()) || (await isDesktop())) {
    await scrollToElement('[for="choice.supportPackage.0"] .etiCustomRadio');
    await t.click(travelerDetailsModule.supportPackageBasic);
    if (await travelerDetailsModule.supportPackageModalNoButton.exists) {
      await t.click(travelerDetailsModule.supportPackageModalNoButton);
    }
  }
}

export async function addSupportPackageBasicNew() {
  await scrollToElement('[for="toggleChoice.supportPackage.0"]');
  await t.click(travelerDetailsModule.supportPackageBasicNew);
  if (await travelerDetailsModule.supportPackageModalNoButton.exists) {
    await t.click(travelerDetailsModule.supportPackageModalNoButton);
  }
}

export async function addSupportPackagePremium() {
  await scrollToElement(travelerDetailsModule.supportPackageBasicStringSelector);
  if (await isMobile()) {
    await t.click(travelerDetailsModule.supportPackagePremiumNew);
  } else if ((await isTablet()) || (await isDesktop())) {
    await t.click(travelerDetailsModule.supportPackagePremium);
  }
}

export async function addSupportPackagePremiumNew() {
  if (await isDesktop()) {
    await scrollToElement(travelerDetailsModule.supportPackageBasicStringSelector);
    await t.click(travelerDetailsModule.supportPackagePremiumNew);
  }
  if ((await isMobile()) || (await isTablet())) {
    await scrollToElement('[data-testid="servicePackage-component"]');
    await t.doubleClick(travelerDetailsModule.supportPackagePremiumSelectMobile);
  }
}

export async function addNoBaggage(numberOfTravelers) {
  await scrollToElement('[data-testid="checkInBaggage-toggleTravelers-true"]');
  if (numberOfTravelers === 1) {
    await t.click(travelerDetailsModule.checkInBaggageNoOnePassenger);
  }
  if (numberOfTravelers > 1) {
    await t.click(travelerDetailsModule.checkInBaggageNoAllPassengers);
  }
  await t
    .expect(travelerDetailsModule.checkInBaggageModalNoButton.exists)
    .ok('', { timeout: 30000 });
  await t.click(travelerDetailsModule.checkInBaggageModalNoButton);
}

export async function addBaggage(numberOfTravelers) {
  if (numberOfTravelers === 1) {
    await scrollToElement('[data-testid="checkInBaggage-traveler-0-true"]');
    await t.click(travelerDetailsModule.checkInBaggageYesOnePassenger);
  }
  if (numberOfTravelers > 1) {
    await scrollToElement('[data-testid="checkInBaggage-toggleTravelers-true"]');
    await t.click(travelerDetailsModule.checkinBaggageYesAllPassengers);
  }
}

export async function addBaggageForTravelers(travelers) {
  await scrollToElement('[data-testid="checkInBaggage-toggleTravelers-true"]');
  await t.click(travelerDetailsModule.checkInBaggageCheckbox);
  for (const traveler of travelers) {
    await t.click(travelerDetailsModule.addBaggageForTraveler(traveler.nr, traveler.baggage));
  }
}

export async function addNoFlexibleTicket(numberOfTravelers) {
  await scrollToElement('.flexibleTicket .etiCheckboxDropdown');
  await dropdownSelect(travelerDetailsModule.flexibleTicketDropDown, numberOfTravelers + 1);
  if (await travelerDetailsModule.flexibleTicketModalNoButton.exists) {
    await t.click(travelerDetailsModule.flexibleTicketModalNoButton);
  }
}

export async function addFlexibleTicketAllTravelers() {
  await scrollToElement('.flexibleTicket .etiCheckboxDropdown');
  await t.click(travelerDetailsModule.flexibleTicketDropDown);
  await dropdownSelect(travelerDetailsModule.flexibleTicketDropDown, 0);
}

export async function addMeal(numberOfTravelers) {
  if (numberOfTravelers === 1) {
    await scrollToElement('[data-testid="meal-container"]');
    await dropdownSelect(travelerDetailsModule.mealDropDownOneTraveler, 1);
  }
  if (numberOfTravelers > 1) {
    await scrollToElement('[data-testid="meal-container"]');
    await t.click(travelerDetailsModule.mealDropDownMultipleTravelers);
    for (let i = 0; i < numberOfTravelers; i += 1) {
      await dropdownSelect(travelerDetailsModule.mealDropDownTraveler.nth(i), 2);
    }
  }
}

async function addNoCabinBaggage() {
  await scrollToElement('[data-testid="cabinBaggage--false"]');
  await t.click(travelerDetailsModule.cabinBaggageNoButton);
}

async function addCabinBaggage() {
  await scrollToElement('[data-testid="cabinBaggage--true"]');
  await t.click(travelerDetailsModule.cabinBaggageYesButton);
}

export async function addNoBaggageService() {
  await scrollToElement('[data-testid="baggageService--false"]');
  await t.click(travelerDetailsModule.baggageServiceNoButton);
}

export async function addBaggageService() {
  await scrollToElement('[data-testid="baggageService--false"]');
  await t.click(travelerDetailsModule.baggageServiceYesButton);
}

async function addNoCancellationInsideEu() {
  await scrollToElement('[data-testid="cancellationInsideEu--false"]');
  await t.click(travelerDetailsModule.cancellationNoInsideEu);
}

async function addCancellationInsideEu() {
  await scrollToElement('[data-testid="cancellationInsideEu--true"]');
  await t.click(travelerDetailsModule.cancellationYesInsideEu);
}

async function addNoCancellationOutsideEu() {
  await scrollToElement('[data-testid="cancellationOutsideEu--false"]');
  await t.click(travelerDetailsModule.cancellationNoOutsideEu);
}

async function addCancellationOutsideEu() {
  await scrollToElement('[data-testid="cancellationOutsideEu--true"]');
  await t.click(travelerDetailsModule.cancellationYesOutsideEu);
}

async function addNoSeatMap() {
  await scrollToElement('[data-testid="seatMap--false"]');
  await t.click(travelerDetailsModule.seatMapNoButton);
}

export async function addSeatMap() {
  await scrollToElement('[data-testid="seatMap--true"]');
  await t.click(travelerDetailsModule.seatMapYesButton);
  await selectSeatsForAllSegmentTypes();
  await saveSeatMapSelections();
}

async function addSms() {
  await scrollToElement('[data-testid="sms--true"]');
  await t.click(travelerDetailsModule.smsYesButton);
}

async function addNoSms() {
  await scrollToElement('[data-testid="sms--false"]');
  await t.click(travelerDetailsModule.smsNoButton);
}

async function addMobileTravelPlan() {
  await scrollToElement('[data-testid="mobileTravelPlan--true"]');
  await t.click(travelerDetailsModule.mobileTravelPlanYesButton);
}

async function addNoMobileTravelPlan() {
  await scrollToElement('[data-testid="mobileTravelPlan--false"]');
  await t.click(travelerDetailsModule.mobileTravelPlanNoButton);
}

async function addOnlineCheckin() {
  await scrollToElement('[data-testid="onlineCheckIn--true"]');
  await t.click(travelerDetailsModule.onlineCheckinYesButton);
}

async function addNoOnlineCheckin() {
  await scrollToElement('[data-testid="onlineCheckIn--false"]');
  await t.click(travelerDetailsModule.onlineCheckinNoButton);
}

async function addNoTravelInsuranceInEu() {
  await scrollToElement('[data-testid="travelInsuranceInsideEu--false"]');
  await t.click(travelerDetailsModule.travelInsuranceInEuNo);
}

async function addTravelInsuranceInEu() {
  await scrollToElement('[data-testid="travelInsuranceInsideEu--true"]');
  await t.click(travelerDetailsModule.travelInsuranceInEuYes);
  await t.click(travelerDetailsModule.travelInsuranceInsideEuModalYes);
}

async function addNoTravelInsuranceOutsideEu() {
  await scrollToElement('[data-testid="travelInsuranceOutsideEu--false"]');
  await t.click(travelerDetailsModule.travelInsuranceOutsideEuNo);
}

async function addTravelInsuranceOutsideEu() {
  await scrollToElement('[data-testid="travelInsuranceOutsideEu--true"]');
  await t.click(travelerDetailsModule.travelInsuranceOutsideEuYes);
  await t.click(travelerDetailsModule.travelInsuranceOusideEuModalYes);
}

export async function addFlexibleTicketOneTraveler(numberOfFlexibleTickets) {
  await scrollToElement('.flexibleTicket .etiCheckboxDropdown');
  await dropdownSelect(travelerDetailsModule.flexibleTicketDropDown, numberOfFlexibleTickets);
}

async function addNoAirHelpPlus() {
  await scrollToElement('[data-testid="airHelp--false"]');
  await t.click(travelerDetailsModule.airHelpPlusNoButton);
}

async function addAirHelpPlus() {
  await scrollToElement('[data-testid="airHelp-container"]');
  await t.click(travelerDetailsModule.airHelpPlusYesButton);
}

async function addNoBaggageInsuranceGenius() {
  await scrollToElement('[data-testid="baggageInsuranceCoverGenius--false"]');
  await t.click(travelerDetailsModule.baggageInsuranceGeniusButtonNo);
}

async function addBaggageInsuranceGenius() {
  await scrollToElement('[data-testid="baggageInsuranceCoverGenius--true"]');
  await t.click(travelerDetailsModule.baggageInsuranceGeniusButtonYes);
}

async function addNoCancellationInsuranceGenius() {
  await scrollToElement('[data-testid="cancellationInsuranceCoverGenius--false"]');
  await t.click(travelerDetailsModule.cancellationInsuranceGeniusButtonNo);
}

async function addCancellationInsuranceGenius() {
  await scrollToElement('[data-testid="cancellationInsuranceCoverGenius--true"]');
  await t.click(travelerDetailsModule.cancellationInsuranceGeniusButtonYes);
}

async function addNoTravelInsuranceGenius() {
  await scrollToElement('[data-testid="travelInsuranceCoverGenius--false"]');
  await t.click(travelerDetailsModule.travelInsuranceGeniusButtonNo);
}

async function addTravelInsuranceGenius() {
  await scrollToElement('[data-testid="travelInsuranceCoverGenius--true"]');
  await t.click(travelerDetailsModule.travelInsuranceGeniusButtonYes);
}

async function addNoBaggageInsuranceGadgetGenius() {
  await scrollToElement('[data-testid="baggageInsuranceGadgetCoverGenius--false"]');
  await t.click(travelerDetailsModule.baggageInsuranceGadgetGeniusButtonNo);
}

async function addBaggageInsuranceGadgetGenius() {
  await scrollToElement('[data-testid="baggageInsuranceGadgetCoverGenius--true"]');
  await t.click(travelerDetailsModule.baggageInsuranceGadgetGeniusButtonYes);
}

async function addNoBaggageComboGenius() {
  await scrollToElement('[data-testid="baggageInsuranceComboCoverGenius--false"]');
  await t.click(travelerDetailsModule.baggageInsuranceComboGeniusNo);
}

async function addNoBankruptcyInsuranceGenius() {
  await scrollToElement('[data-testid="bankruptcyInsuranceCoverGenius--false"]');
  await t.click(travelerDetailsModule.bankruptcyInsuranceGeniusButtonNo);
}

async function addBankruptcyInsuranceGenius() {
  await scrollToElement('[data-testid="bankruptcyInsuranceCoverGenius--true"]');
  await t.click(travelerDetailsModule.bankruptcyInsuranceGeniusButtonYes);
}

async function addBaggageComboGenius() {
  await scrollToElement('[data-testid="baggageInsuranceComboCoverGenius--true"]');
  await t.click(travelerDetailsModule.baggageInsuranceComboGeniusYes);
}

export async function addComprehensiveInsuranceGenius() {
  await scrollToElement('[data-testid="comprehensiveInsuranceCoverGenius--true"]');
  await t.click(travelerDetailsModule.comprehensiveInsuranceGeniusButtonYes);
}

async function addNoComprehensiveInsuranceGenius() {
  await scrollToElement('[data-testid="comprehensiveInsuranceCoverGenius--false"]');
  await t.click(travelerDetailsModule.comprehensiveInsuranceGeniusButtonNo);
}

async function addNoManulifeAllInclusive() {
  await scrollToElement('[data-testid="allInclusiveProtection--false"]');
  await t.click(travelerDetailsModule.manulifeAllinclusiveNoButton);
}

export async function addManulifeAllInclusive(travelers) {
  await scrollToElement('[data-testid="allInclusiveProtection--true"]');
  await t.click(travelerDetailsModule.manulifeAllinclusiveYesButton);
  await dropdownSelect(travelerDetailsModule.manulifeAllinclusiveProvinceInput, 0);
  for (const traveler of travelers) {
    const dateOfBirth = getDateOfBirth(parseInt(traveler.age, 10));
    await t.typeText(
      travelerDetailsModule.setDateOfBirthManulifeAllInclusive(traveler.nr),
      dateOfBirth,
    );
  }
  await t.click(travelerDetailsModule.manulifeAllinclusiveContainer);
}

async function addNoManulifeCancellation() {
  await scrollToElement('[data-testid="tripCancellationProtection--false"]');
  await t.click(travelerDetailsModule.manulifeCancellationNoButton);
}

export async function addManulifeCancellation(travelers) {
  await scrollToElement('[data-testid="tripCancellationProtection--true"]');
  await t.click(travelerDetailsModule.manulifeCancellationYesButton);
  await dropdownSelect(travelerDetailsModule.manulifeCancellationProvinceInput, 0);
  for (const traveler of travelers) {
    const dateOfBirth = getDateOfBirth(parseInt(traveler.age, 10));
    await t.typeText(
      travelerDetailsModule.setDateOfBirthManulifeCancellation(traveler.nr),
      dateOfBirth,
    );
  }
  await t.click(travelerDetailsModule.manulifeCancellationContainer);
}

async function addNosimpleVisa() {
  await scrollToElement('[data-testid="simpleVisa--false"]');
  await t.click(travelerDetailsModule.simpleVisaNoButton);
}

async function addSimpleVisa() {
  await scrollToElement('[data-testid="simpleVisa--true"]');
  await t.click(travelerDetailsModule.simpleVisaYesButton);
}

export async function addNoExtraProducts(numberOfTravelers) {
  await t.expect(travelerDetailsModule.travelerDetailsForm.exists).ok();

  if (
    (await travelerDetailsModule.cabinBaggageContainer.exists) &&
    (await travelerDetailsModule.cabinBaggageContainer.visible)
  ) {
    await addNoCabinBaggage();
  }
  if (
    (await travelerDetailsModule.baggageServiceContainer.exists) &&
    (await travelerDetailsModule.baggageServiceContainer.visible)
  ) {
    await addNoBaggageService();
  }
  if (await isMobile()) {
    if (
      (await travelerDetailsModule.supportPackageBasicMobile.exists) &&
      (await travelerDetailsModule.supportPackageBasicMobile.visible)
    ) {
      await addSupportPackageBasic();
    }
  } else if ((await isTablet()) || (await isDesktop())) {
    if (
      (await travelerDetailsModule.supportPackageBasic.exists) &&
      (await travelerDetailsModule.supportPackageBasic.visible)
    ) {
      await addSupportPackageBasic();
    }
  }
  if (
    (await travelerDetailsModule.supportPackageBasicNew.exists) &&
    (await travelerDetailsModule.supportPackageBasicNew.visible)
  ) {
    await addSupportPackageBasicNew();
  }
  if (
    (await travelerDetailsModule.checkInBaggageNoOnePassenger.exists) ||
    (await travelerDetailsModule.checkInBaggageNoAllPassengers.exists)
  ) {
    await addNoBaggage(numberOfTravelers);
  }
  if (
    (await travelerDetailsModule.flexibleTicketContainer.exists) &&
    (await travelerDetailsModule.flexibleTicketContainer.visible)
  ) {
    await addNoFlexibleTicket(numberOfTravelers);
  }
  if (
    (await travelerDetailsModule.cancellationInsideEuContainer.exists) &&
    (await travelerDetailsModule.cancellationInsideEuContainer.visible)
  ) {
    await addNoCancellationInsideEu();
  }
  if (
    (await travelerDetailsModule.cancellationOutsideEuContainer.exists) &&
    (await travelerDetailsModule.cancellationOutsideEuContainer.visible)
  ) {
    await addNoCancellationOutsideEu();
  }
  if (
    (await travelerDetailsModule.airHelpContainer.exists) &&
    (await travelerDetailsModule.airHelpContainer.visible)
  ) {
    await addNoAirHelpPlus();
  }
  if (
    (await travelerDetailsModule.seatMapContainer.exists) &&
    (await travelerDetailsModule.seatMapContainer.visible)
  ) {
    await addNoSeatMap();
  }
  if (
    (await travelerDetailsModule.smsContainer.exists) &&
    (await travelerDetailsModule.smsContainer.visible)
  ) {
    await addNoSms();
  }
  if (
    (await travelerDetailsModule.mobileTravelPlanContainer.exists) &&
    (await travelerDetailsModule.mobileTravelPlanContainer.visible)
  ) {
    await addNoMobileTravelPlan();
  }
  if (
    (await travelerDetailsModule.onlineCheckinBaggageContainer.exists) &&
    (await travelerDetailsModule.onlineCheckinBaggageContainer.visible)
  ) {
    await addNoOnlineCheckin();
  }
  if (
    (await travelerDetailsModule.travelInsuranceInsideEuContainer.exists) &&
    (await travelerDetailsModule.travelInsuranceInsideEuContainer.visible)
  ) {
    await addNoTravelInsuranceInEu();
  }
  if (
    (await travelerDetailsModule.travelInsuranceOutsideEuContainer.exists) &&
    (await travelerDetailsModule.travelInsuranceOutsideEuContainer.visible)
  ) {
    await addNoTravelInsuranceOutsideEu();
  }
  if (
    (await travelerDetailsModule.baggageInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.baggageInsuranceGeniusContainer.visible)
  ) {
    await addNoBaggageInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.cancellationInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.cancellationInsuranceGeniusContainer.visible)
  ) {
    await addNoCancellationInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.travelInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.travelInsuranceGeniusContainer.visible)
  ) {
    await addNoTravelInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.baggageInsuranceGadgetGeniusContainer.exists) &&
    (await travelerDetailsModule.baggageInsuranceGadgetGeniusContainer.visible)
  ) {
    await addNoBaggageInsuranceGadgetGenius();
  }
  if (
    (await travelerDetailsModule.baggageInsuranceComboGeniusContainer.exists) &&
    (await travelerDetailsModule.baggageInsuranceComboGeniusContainer.visible)
  ) {
    await addNoBaggageComboGenius();
  }
  if (
    (await travelerDetailsModule.bankruptcyInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.bankruptcyInsuranceGeniusContainer.visible)
  ) {
    await addNoBankruptcyInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.comprehensiveInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.comprehensiveInsuranceGeniusContainer.visible)
  ) {
    await addNoComprehensiveInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.manulifeAllinclusiveContainer.exists) &&
    (await travelerDetailsModule.manulifeAllinclusiveContainer.visible)
  ) {
    await addNoManulifeAllInclusive();
  }
  if (
    (await travelerDetailsModule.manulifeCancellationContainer.exists) &&
    (await travelerDetailsModule.manulifeCancellationContainer.visible)
  ) {
    await addNoManulifeCancellation();
  }
  if (
    (await travelerDetailsModule.simpleVisaContainer.exists) &&
    (await travelerDetailsModule.simpleVisaContainer.visible)
  ) {
    await addNosimpleVisa();
  }
}

export async function addAllExtraProducts(nrOfTravelers, travelers) {
  await t.expect(travelerDetailsModule.travelerDetailsForm.exists).ok();

  if (
    (await travelerDetailsModule.checkInBaggageButtons.exists) &&
    (await travelerDetailsModule.checkInBaggageButtons.visible)
  ) {
    await addBaggage(nrOfTravelers);
  }
  if (
    (await travelerDetailsModule.cabinBaggageContainer.exists) &&
    (await travelerDetailsModule.cabinBaggageContainer.visible)
  ) {
    await addCabinBaggage();
  }
  if (
    (await travelerDetailsModule.baggageServiceContainer.exists) &&
    (await travelerDetailsModule.baggageServiceContainer.visible)
  ) {
    await addBaggageService();
  }
  if (
    (await travelerDetailsModule.flexibleTicketContainer.exists) &&
    (await travelerDetailsModule.flexibleTicketContainer.visible)
  ) {
    await addFlexibleTicketAllTravelers();
  }
  if (await isMobile()) {
    if (
      (await travelerDetailsModule.supportPackagePremiumNew.exists) &&
      (await travelerDetailsModule.supportPackagePremiumNew.visible)
    ) {
      await addSupportPackagePremium();
    }
  } else if ((await isTablet()) || (await isDesktop())) {
    if (
      (await travelerDetailsModule.supportPackagePremium.exists) &&
      (await travelerDetailsModule.supportPackagePremium.visible)
    ) {
      await addSupportPackagePremium();
    }
  }
  if (await isMobile()) {
    if (
      (await travelerDetailsModule.supportPackageComponentNew.exists) &&
      (await travelerDetailsModule.supportPackageComponentNew.visible)
    ) {
      await addSupportPackagePremiumNew();
    }
  }
  if (
    (await travelerDetailsModule.onlineCheckinBaggageContainer.exists) &&
    (await travelerDetailsModule.onlineCheckinBaggageContainer.visible)
  ) {
    await addOnlineCheckin();
  }
  if (
    (await travelerDetailsModule.airHelpContainer.exists) &&
    (await travelerDetailsModule.airHelpContainer.visible)
  ) {
    await addAirHelpPlus();
  }
  if (
    (await travelerDetailsModule.cancellationOutsideEuContainer.exists) &&
    (await travelerDetailsModule.cancellationOutsideEuContainer.visible)
  ) {
    await addCancellationOutsideEu();
  }
  if (
    (await travelerDetailsModule.cancellationInsideEuContainer.exists) &&
    (await travelerDetailsModule.cancellationInsideEuContainer.visible)
  ) {
    await addCancellationInsideEu();
  }
  if (
    (await travelerDetailsModule.travelInsuranceInEuNo.exists) &&
    (await travelerDetailsModule.travelInsuranceInEuNo.visible)
  ) {
    await addTravelInsuranceInEu();
  }
  if (
    (await travelerDetailsModule.travelInsuranceOutsideEuContainer.exists) &&
    (await travelerDetailsModule.travelInsuranceOutsideEuContainer.visible)
  ) {
    await addTravelInsuranceOutsideEu();
  }
  if (
    (await travelerDetailsModule.mealContainer.exists) &&
    (await travelerDetailsModule.mealContainer.visible)
  ) {
    await addMeal(nrOfTravelers);
  }
  if (
    (await travelerDetailsModule.baggageInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.baggageInsuranceGeniusContainer.visible)
  ) {
    await addBaggageInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.cancellationInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.cancellationInsuranceGeniusContainer.visible)
  ) {
    await addCancellationInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.travelInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.travelInsuranceGeniusContainer.visible)
  ) {
    await addTravelInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.baggageInsuranceGadgetGeniusContainer.exists) &&
    (await travelerDetailsModule.baggageInsuranceGadgetGeniusContainer.visible)
  ) {
    await addBaggageInsuranceGadgetGenius();
  }
  if (
    (await travelerDetailsModule.baggageInsuranceComboGeniusContainer.exists) &&
    (await travelerDetailsModule.baggageInsuranceComboGeniusContainer.visible)
  ) {
    await addBaggageComboGenius();
  }
  if (
    (await travelerDetailsModule.bankruptcyInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.bankruptcyInsuranceGeniusContainer.visible)
  ) {
    await addBankruptcyInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.comprehensiveInsuranceGeniusContainer.exists) &&
    (await travelerDetailsModule.comprehensiveInsuranceGeniusContainer.visible)
  ) {
    await addComprehensiveInsuranceGenius();
  }
  if (
    (await travelerDetailsModule.seatMapContainer.exists) &&
    (await travelerDetailsModule.seatMapContainer.visible)
  ) {
    await addSeatMap();
  }
  if (
    (await travelerDetailsModule.smsContainer.exists) &&
    (await travelerDetailsModule.smsContainer.visible)
  ) {
    await addSms();
  }
  if (
    (await travelerDetailsModule.mobileTravelPlanContainer.exists) &&
    (await travelerDetailsModule.mobileTravelPlanContainer.visible)
  ) {
    await addMobileTravelPlan();
  }
  if (
    (await travelerDetailsModule.manulifeAllinclusiveContainer.exists) &&
    (await travelerDetailsModule.manulifeAllinclusiveContainer.visible)
  ) {
    await addManulifeAllInclusive(travelers);
  }
  if (
    (await travelerDetailsModule.manulifeCancellationContainer.exists) &&
    (await travelerDetailsModule.manulifeCancellationContainer.visible)
  ) {
    await addManulifeCancellation(travelers);
  }
  if (
    (await travelerDetailsModule.simpleVisaContainer.exists) &&
    (await travelerDetailsModule.simpleVisaContainer.visible)
  ) {
    await addSimpleVisa();
  }
}

export async function getBaggagePrice() {
  await t.expect(travelerDetailsModule.checkInBaggagePrice.exists).ok();
  const priceText = await travelerDetailsModule.checkInBaggagePrice.innerText;
  const indexStart = 1;
  const indexEnd = priceText.search(' SEK');
  const price = priceText.substring(indexStart, indexEnd);

  return parseInt(price.replace(/\s+/g, ''), 10);
}

async function getPriceText() {
  let priceText;
  if ((await isMobile()) || (await isTablet())) {
    priceText = await travelerDetailsModule.cartBaggagePriceMobile.innerText;
  }
  if (await isDesktop()) {
    priceText = await travelerDetailsModule.cartBaggagePrice.innerText;
  }
  return priceText;
}

export async function getBaggageCartPrice() {
  const priceText = await getPriceText();
  return getPriceFromText(priceText);
}

export async function countProductsInCart() {
  if ((await isMobile()) || (await isTablet())) {
    return travelerDetailsModule.allProductsInCartMobile.count;
  }
  if (await isDesktop()) {
    return travelerDetailsModule.allProductsInCart.count;
  }
}
