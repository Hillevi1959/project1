/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';

export default {
  allSeatsSelectedConfirmationAccept: Selector(
    '[data-testid="seatMap-allSeatsSelectedConfirmation-accept"]',
  ),
  allSeatsSelectedConfirmationDismiss: Selector(
    '[data-testid="seatMap-allSeatsSelectedConfirmation-dismiss"]',
  ),
  cancelSeatMapbutton: Selector('[data-testid="cancelSeatMap-button"]'),
  changeSeatsButton: Selector('[data-testid="seatMapChangeSelection-button"]'),
  closeButton: Selector('[data-testid="seatMap-closeIcon-button"]'),
  editSeatButton: Selector('[data-testid*="edit-button"]'),
  editSeatForFirstTravelerOverview: Selector(
    '[data-testid="seatMapSummaryActionsCell-bound-1-segment-11-traveler-0-edit-button"]',
  ),
  firstFreeSeat: Selector('.seatMap__main [data-for]').nth(1),
  firstTraveler: Selector('.seatMap__traveler').nth(0),
  getSeatById: id => Selector(`#${id}`),
  modalContent: Selector('.ReactModal__Content'),
  productNoButton: Selector('[data-testid="seatMap--false"]'),
  productYesButton: Selector('[data-testid="seatMap--true"]'),
  readMoreLink: Selector('[data-testid="seatMap-readMoreLink"]'),
  removeSeatForFirstTravelerOverview: Selector(
    '[data-testid="seatMapSummaryActionsCell-bound-1-segment-11-traveler-0-remove-button"]',
  ),
  removeSeatForFirstTravelerSeatSelection: Selector(
    '[data-testid="seatMapTraveler-0-removeSelection-button"]',
  ),
  saveAndContinueButton: Selector('[data-testid="saveAndContinue-button"]'),
  secondFreeSeat: Selector('.seatMap__main [data-for]').nth(2),
  seatInformationForFirstTraveler: Selector('[data-testid="seatMapTraveler-0-selectedSeat"]'),
  seatingBesideOption: Selector('[data-testid="seating-combo-SeatingBeside_id_option_1"]'),
  seatingLightOptions: Selector('[data-testid^="seating-combo-SeatingLight_id_option"]'),
  seatingPreferenceOptions: Selector('[data-testid^="seating-combo-SeatingPreference_id_option"]'),
  seatMapContent: Selector('[data-testid="seatmap-mainContent"]'),
  seatMapNotification: Selector('[data-testid="seatmap-mainContent"] .etiNotification'),
  seatMapNotificatonCloseButton: Selector(
    '[data-testid="seatmap-mainContent"] .etiNotification .etiIcon',
  ),
  seatMapProduct: Selector('.seatMap'),
  seatMapTravelerInfo: Selector('.seatMap__travelerInfo'),
  seatMapSummary: Selector('[data-testid="seatMap-summaryTable"]'),
  seatSelection: Selector('.seatMap__main'),
  segmentTab: i =>
    Selector('[data-testid^="seatMap-stepIndicatorItem-button"]:not([disabled])').nth(i),
  selectedTravelerInformation: i =>
    Selector(`[data-testid="seatMapTraveler-${i}-selectedSeat"] span`),
  selectSeatForFirstTravelerOverview: Selector(
    '[data-testid="seatMapSummaryActionsCell-bound-1-segment-11-traveler-0-selectSeat-button"]',
  ),
  stepIdicatorButton: Selector('[data-testid^="seatMap-stepIndicatorItem-button"]:not([disabled])'),
  travelerTab: i => Selector(`[data-testid="seatMapTraveler-${i}"] button`),
  travelerSeat: i => Selector('.seatMap__main [data-for]').nth(i),
  verifyCloseSeatMap: Selector('[data-testid="seatMap-persist-modal-dismiss"]'),
};
