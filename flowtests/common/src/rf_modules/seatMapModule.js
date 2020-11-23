/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';

export default {
  allSeatsSelectedConfirmationDismiss: Selector(
    '[data-testid="seatMap-allSeatsSelectedConfirmation-dismiss"]',
  ),
  allSeatsSelectedConfirmationAccept: Selector(
    '[data-testid="seatMap-allSeatsSelectedConfirmation-accept"]',
  ),
  cancelSeatMapbutton: Selector('[data-testid="cancelSeatMap-button"]'),
  changeSeatsButton: Selector('[data-testid="seatMapChangeSelection-button"]'),
  closeButton: Selector('[data-testid="seatMap-closeIcon-button"]'),
  editSeatForFirstTravelerOverview: Selector(
    '[data-testid="seatMapSummaryActionsCell-bound-1-segment-11-traveler-0-edit-button"]',
  ),
  editSeatButton: Selector('[data-testid*="edit-button"]'),
  firstFreeSeat: Selector('.seatMap__main [data-for]').nth(1),
  firstTraveler: Selector('.seatMap__traveler').nth(0),
  modalContent: Selector('.ReactModal__Content'),
  productYesButton: Selector('[data-testid="seatMap--true"]'),
  productNoButton: Selector('[data-testid="seatMap--false"]'),
  readMoreLink: Selector('[data-testid="seatMap-readMoreLink"]'),
  removeSeatForFirstTravelerSeatSelection: Selector(
    '[data-testid="seatMapTraveler-0-removeSelection-button"]',
  ),
  removeSeatForFirstTravelerOverview: Selector(
    '[data-testid="seatMapSummaryActionsCell-bound-1-segment-11-traveler-0-remove-button"]',
  ),
  saveAndContinueButton: Selector('[data-testid="saveAndContinue-button"]'),
  seatMapContent: Selector('[data-testid="seatmap-mainContent"]'),
  seatMapProduct: Selector('.seatMap'),
  seatMapSummary: Selector('[data-testid="seatMap-summaryTable"]'),
  seatMapNotification: Selector('[data-testid="seatmap-mainContent"] .etiNotification'),
  seatMapNotificatonCloseButton: Selector(
    '[data-testid="seatmap-mainContent"] .etiNotification .etiIcon',
  ),
  seatMapTravelerInfo: Selector('.seatMap__travelerInfo'),
  seatSelection: Selector('.seatMap__main'),
  seatInformationForFirstTraveler: Selector('[data-testid="seatMapTraveler-0-selectedSeat"]'),

  selectSeatForFirstTravelerOverview: Selector(
    '[data-testid="seatMapSummaryActionsCell-bound-1-segment-11-traveler-0-selectSeat-button"]',
  ),
  secondFreeSeat: Selector('.seatMap__main [data-for]').nth(2),
  seatingPreferenceOptions: Selector('[data-testid^="seating-combo-SeatingPreference_id_option"]'),
  seatingLightOptions: Selector('[data-testid^="seating-combo-SeatingLight_id_option"]'),
  seatingBesideOption: Selector('[data-testid="seating-combo-SeatingBeside_id_option_1"]'),
  stepIdicatorButton: Selector('[data-testid^="seatMap-stepIndicatorItem-button"]:not([disabled])'),
  verifyCloseSeatMap: Selector('[data-testid="seatMap-persist-modal-dismiss"]'),
  getSeatById: id => Selector(`#${id}`),
  segmentTab: i =>
    Selector('[data-testid^="seatMap-stepIndicatorItem-button"]:not([disabled])').nth(i),
  selectedTravelerInformation: i =>
    Selector(`[data-testid="seatMapTraveler-${i}-selectedSeat"] span`),
  travelerTab: i => Selector(`[data-testid="seatMapTraveler-${i}"] button`),
  travelerSeat: i => Selector('.seatMap__main [data-for]').nth(i),
};
