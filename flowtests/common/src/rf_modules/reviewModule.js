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
  baggageServiceChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-selectedExtraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-baggageService"]',
  ),
  baggageServiceProduct: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-baggageService"]',
  ),
  editExtraProductsButton: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-edit"]',
  ),
  editTravelersButton: Selector(
    '[data-testid="travelerDetails-reviewModal-travelerInformation-editTravelers"]',
  ),
  editTripButton: Selector('[data-testid="travelerDetails-reviewModal-flightInformation"]'),
  flexTicketChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-selectedExtraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-flexibleTicket"]',
  ),
  flexTicketNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-flexibleTicket"]',
  ),
  seatMapNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-seatMap"]',
  ),
  supportPackageNotChosen: Selector(
    '[data-testid="travelerDetails-reviewModal-extraProducts-section"] [data-testid="travelerDetails-reviewModal-extraProducts-servicePackage"]',
  ),
  firstBoundPlaneIcon: Selector(
    '[data-testid="travelerDetails-reviewModal-flightInformation-bound-1"] [data-testid="tripDetails-bound-plane-icon"]',
  ),
  secondBoundTrainIcon: Selector(
    '[data-testid="travelerDetails-reviewModal-flightInformation-bound-2"] [data-testid="tripDetails-bound-train-icon"]',
  ),
  travelers: Selector('[data-testid*="tdReviewInfo-traveler"]'),
  traveler: passengerNr =>
    Selector(
      `[data-testid="travelerDetails-reviewModal-travelerInformation-traveler-${passengerNr}"]`,
    ),
  tripInfoText: Selector(
    '[data-testid="travelerDetails-reviewModal-flightInformation-bound-1-eventSegment-1"]',
  ),
  tripSegments: Selector('[data-testid*="-bound-"] [data-testid*="-segment-"]'),
};
