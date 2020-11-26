import { Selector } from 'testcafe';

export default {
  codeName: Selector('[name="code"]'),
  discountItemLink: Selector('[href*="DiscountItem"]'),
  discountCodeField: Selector('[name="code"]'),
  discountLinkResponsive: Selector('.tdText a').nth(3),
  logInButton: Selector('.btn-success'),
  nuberOfCodes: Selector('[name="numUsages"]'),
  mailShortConnectionInfo: Selector('.viTripWithShortConnectionTimeNotification'),
  mailSelfTransferInfo: Selector('.tripInformationItem.VirtualInterlining'),
  messageList: Selector('[name="msg"]'),
  messageListOption: Selector('[name="msg"]').find('option'),
  numberOfCodesLeft: Selector('[name="numUsagesLeft"]'),
  numberOfDiscountRows: Selector('tr.odd'),
  orderNumberInput: Selector('[name="anyRef"]'),
  orderSearchDatePicker: Selector('#datetime_icon_0'),
  orderSearchPreviousMonth: Selector('.ui-icon.ui-icon-circle-triangle-w'),
  orderSearchDoneDateButton: Selector('.ui-datepicker-close'),
  firstOrderNumberInResultTable: Selector(
    '.resultSet:nth-child(2) tbody tr:nth-child(1) td:nth-child(4) a',
  ),
  passwordInput: Selector('[name="passWord"]'),
  providerBookingIdLink: Selector(
    '[id*="AirBookings"] .e-tabs-content .e-tabs-tab-content > table > tbody > tr > td:nth-child(2) > a',
  ),
  providerBookingId: Selector(
    '[id*="AirBookings"] .e-tabs-content .e-tabs-tab-content > table > tbody > tr > td:nth-child(2) > span',
  ),
  realDiscountGeneratorButton: Selector('.group.noToggler.left > .button.button-green').nth(1),
  dummyDiscountGeneratorButton: Selector('.group.noToggler.left > .button.button-green').nth(0),
  submitButton: Selector('[name="__submit"]'),
  userNameInput: Selector('[name="userName"]'),
};
