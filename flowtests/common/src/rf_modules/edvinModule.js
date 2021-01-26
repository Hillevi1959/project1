import { Selector } from 'testcafe';

export default {
  activatePaymentLinkButton: Selector('footer button').nth(0),
  addOnProductsModal: Selector('.availableAddOnProducts'),
  addOnPurchaseButton: Selector('#goToAddOnPurchases'),
  avaliableAddOnProducts: productNr =>
    Selector(
      `.availableAddOnProducts > div > div > div > div > div:nth-child(${productNr}) .fa.fa-shopping-cart`,
    ),
  codeName: Selector('[name="code"]'),
  createAddOnCartButton: Selector('#addOnPurchasePlaceholder button').nth(0),
  discountItemLink: Selector('[href*="DiscountItem"]'),
  discountCodeField: Selector('[name="code"]'),
  discountLinkResponsive: Selector('.tdText a').nth(3),
  dummyDiscountGeneratorButton: Selector('.group.noToggler.left > .button.button-green').nth(0),
  logInButton: Selector('.btn-success'),
  numberOfCodes: Selector('[name="numUsages"]'),
  numberOfCodesLeft: Selector('[name="numUsagesLeft"]'),
  numberOfDiscountRows: Selector('tr.odd'),
  orderNumberInput: Selector('[name="anyRef"]'),
  orderSearchDatePicker: Selector('#datetime_icon_0'),
  orderSearchPreviousMonth: Selector('.ui-icon.ui-icon-circle-triangle-w'),
  orderSearchDoneDateButton: Selector('.ui-datepicker-close'),
  passwordInput: Selector('[name="passWord"]'),
  paymentLink: Selector('[name="paymentLinkForTest"]'),
  product: Selector('.resultSet:nth-child(2) tbody tr'),
  productPrice: Selector('[name="fullPrice"]'),
  providerBookingIdLink: Selector(
    '[id*="AirBookings"] .e-tabs-content .e-tabs-tab-content > table > tbody > tr > td:nth-child(2) > a',
  ),
  saveProductButton: Selector('[title="Save Product"]'),
  submitButton: Selector('[name="__submit"]'),
  userNameInput: Selector('[name="userName"]'),
};
