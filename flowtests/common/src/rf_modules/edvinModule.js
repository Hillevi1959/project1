import { Selector } from 'testcafe';

export default {
  // Log in to Edvin
  logInButton: Selector('.btn-success'),
  passwordInput: Selector('[name="passWord"]'),
  userNameInput: Selector('[name="userName"]'),
  // Add on purchase on an order
  activatePaymentLinkButton: Selector('footer button').nth(0),
  addOnProductsModal: Selector('.availableAddOnProducts'),
  addOnPurchaseButton: Selector('#goToAddOnPurchases'),
  avaliableAddOnProducts: productNr =>
    Selector(
      `.availableAddOnProducts > div > div > div > div > div:nth-child(${productNr}) .fa.fa-shopping-cart`,
    ),
  createAddOnCartButton: Selector('#addOnPurchasePlaceholder button').nth(0),
  paymentLink: Selector('[name="paymentLinkForTest"]'),
  // Discount handling
  codeName: Selector('[name="code"]'),
  numberOfCodes: Selector('[name="numUsages"]'),
  numberOfCodesLeft: Selector('[name="numUsagesLeft"]'),
  numberOfDiscountRows: Selector('tr.odd'),
  submitButton: Selector('[name="__submit"]'),
  // Create voucher
  discountCodeField: Selector('[name="code"]'),
  discountItemLink: Selector('[href*="DiscountItem"]'),
  discountLinkResponsive: Selector('.tdText a').nth(3),
  dummyDiscountGeneratorButton: Selector('.group.noToggler.left > .button.button-green').nth(0),
  providerBookingIdLink: Selector(
    '[id*="AirBookings"] .e-tabs-content .e-tabs-tab-content > table > tbody > tr > td:nth-child(2) > a',
  ),
  // Search order
  orderNumberInput: Selector('[name="anyRef"]'),
  orderSearchDatePicker: Selector('#datetime_icon_0'),
  orderSearchPreviousMonth: Selector('.ui-icon.ui-icon-circle-triangle-w'),
  orderSearchDoneDateButton: Selector('.ui-datepicker-close'),
  // Set price on product
  product: Selector('.resultSet:nth-child(2) tbody tr'),
  productPrice: Selector('[name="fullPrice"]'),
  saveProductButton: Selector('[title="Save Product"]'),
  // Handle props
  keyName: Selector('[name="keyName"]'),
  searchButton: Selector('[name="__submit"]'),
  groupNameInput: Selector('[name="groupName"]'),
  valueInput: Selector('[name="value"]'),
  noPropFoundAlert: Selector('.alert.alert-info', { timeout: 3000 }),
  addPropertyCheckbox: Selector('.checkboxLabel').withText('Add property if not found'),
  propInList: propName => Selector('td').withText(propName),
  keyValue: Selector('[name="keyvalue"]'),
  saveProp: Selector('[value="Save"]').nth(1),
  // Reload props and textkeys
  cacheTriggerAlert: Selector('[role="alert"]', { timeout: 3000 }),
  reloadImmediatelyButton: Selector('[name="formButton"]'),
  selectAllCheckboxes: Selector(
    '[title="Click to Select/Deselect all Checkboxes. Mouse over the Checkboxes with SHIFT to select, Mouse over and ALT to deselect."]',
  ),
};
