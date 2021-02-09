import { Selector } from 'testcafe';

export default {
  addFlexTicketButton: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-flexibleTicket"] button',
  ),
  bookNowModalButton: Selector('[data-testid="bookNowModal-button"]'),
  cancellationProtectionNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-cancellationInsideEu"]',
  ),
  checkinBaggageChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-selectedExtraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-checkInBaggage"]',
  ),
  editExtraProductsButton: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-edit"]',
  ),
  editTravelersButton: Selector(
    '[data-testid="travelerDetails-reviewModal-travelerInformation-editTravelers"]',
  ),
  firstBoundPlaneIcon: Selector(
    '[data-testid="travelerDetails-reviewModal-flightInformation-bound-1"] [data-testid="tripDetails-bound-plane-icon"]',
  ),
  flexTicketChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-selectedExtraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-flexibleTicket"]',
  ),
  flexTicketNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-flexibleTicket"]',
  ),
  seatMapNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-seatMap"]',
  ),
  supportPackageChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-selectedExtraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-servicePackage"]',
  ),
  supportPackageNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-servicePackage"]',
  ),
  secondBoundTrainIcon: Selector(
    '[data-testid="travelerDetails-reviewModal-flightInformation-bound-2"] [data-testid="tripDetails-bound-train-icon"]',
  ),
  traveler: passengerNr =>
    Selector(
      `[data-testid="travelerDetails-reviewModal-travelerInformation-traveler-${passengerNr}"]`,
    ),
};
