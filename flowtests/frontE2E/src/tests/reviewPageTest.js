import { t } from 'testcafe';
import {
  acceptCookies,
  clearField,
  getDateOfBirth,
  getSiteUrl,
} from '../../../common/src/util/common';
import config from '../../testdata.json';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider, setIBEDummyPaymentBankOn } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import {
  addTravelerInformation,
  clickProceedToReviewButton,
  toggleCart,
} from '../../../common/src/rf_pages/travelerDetails';
import {
  addBaggage,
  addBaggageService,
  addNoBaggageService,
  addNoExtraProducts,
} from '../../../common/src/rf_pages/travelerDetailsProducts';
import {
  addNumberToTraveler,
  getFirstChild,
  getFirstAdult,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import reviewModule from '../../../common/src/rf_modules/reviewModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import { openCartIfClosed, payWithDummyBank } from '../../../common/src/rf_pages/payment';
import orderModule from '../../../common/src/rf_modules/orderModule';
import { messageSupersaverSe, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import { isDesktop, isMobile, isTablet } from '../../../common/src/util/device';
import { scrollToElement } from '../../../common/src/util/clientFunction';

const url = getSiteUrl('supersaver-se', config.host);
const props = {
  'IbeClient.TravelerDetails.Modal': 'REVIEW',
  'IbeClient.SearchResult.Flex.Behaviour': 'BUTTON',
  'Payment.RemoveAdressForBank.Enable': false,
};
const numberOfAdults = 2;
const newLastName = 'Bergqvist';
const airport1 = 'Stockholm-Skavsta';
const airport2 = 'London Stansted';
const travelerVerificationString = '2 vuxna';

fixture('Verify review page')
  .page(url)
  .beforeEach(async () => {
    await enableDebug();
    await acceptCookies();
    await setIBEDummyPaymentBankOn();
    await selectProvider('IbeGDSDummy');
    await setProps(props);
    await closeHeaderUrgencyBanner();
  });

test('Edit travelers on review page', async () => {
  const travelers = addNumberToTraveler([
    getFirstAdult(),
    getSecondAdult(),
    getFirstChild(),
    getFirstInfant(),
  ]);
  const newPhoneNumber = '444444444444';
  const newChildDob = '2013-01-25';
  const newInfantFirstName = 'Anna';
  await searchAndSelectTrip(numberOfAdults, 1, 1, 'return trip', 'STO', 'LON', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + 1);
  await clickProceedToReviewButton();

  await t.expect(reviewModule.traveler(0).innerText).contains(travelers[0].phone);
  await t.expect(reviewModule.traveler(1).innerText).contains(travelers[1].lastName);
  await t.expect(reviewModule.traveler(2).innerText).contains(getDateOfBirth(travelers[2].age));
  await t.expect(reviewModule.traveler(3).innerText).contains(travelers[3].firstName);

  await t.click(reviewModule.editTravelersButton);
  await clearField(travelerDetailsModule.contactPersonPhone);
  await t.typeText(travelerDetailsModule.contactPersonPhone, newPhoneNumber);
  await clearField(travelerDetailsModule.setLastName(travelers[1].nr));
  await t.typeText(travelerDetailsModule.setLastName(travelers[1].nr), newLastName);
  await clearField(travelerDetailsModule.setDateOfBirth(travelers[2].nr));
  await t.typeText(travelerDetailsModule.setDateOfBirth(travelers[2].nr), newChildDob);
  await clearField(travelerDetailsModule.setFirstName(travelers[3].nr));
  await t.typeText(travelerDetailsModule.setFirstName(travelers[3].nr), newInfantFirstName);
  await clickProceedToReviewButton();

  await t.expect(reviewModule.traveler(0).innerText).contains(newPhoneNumber);
  await t.expect(reviewModule.traveler(1).innerText).contains(newLastName);
  await t.expect(reviewModule.traveler(2).innerText).contains(newChildDob);
  await t.expect(reviewModule.traveler(3).innerText).contains(newInfantFirstName);
});

test('Edit traveler and extra products on review page and proceed to payment page', async () => {
  const travelers = addNumberToTraveler([getFirstAdult(), getSecondAdult()]);

  // Select trip
  await searchAndSelectTrip(numberOfAdults, 0, 0, 'return trip', 'STO', 'LON', 'ECONOMY', [11, 24]);
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await addBaggage(numberOfAdults);
  await addBaggageService();
  await clickProceedToReviewButton();
  // Edit travelers
  await t.click(reviewModule.editTravelersButton);
  await clearField(travelerDetailsModule.setLastName(travelers[1].nr));
  await t.typeText(travelerDetailsModule.setLastName(travelers[1].nr), newLastName);
  await clickProceedToReviewButton();
  // Edit extra products
  await t.expect(reviewModule.baggageServiceChosen.visible).ok();
  await t.expect(reviewModule.checkinBaggageChosen.visible).ok();
  await t.expect(reviewModule.flexTicketNotChosen.visible).ok();
  await t.expect(reviewModule.seatMapNotChosen.visible).ok();
  await t.expect(reviewModule.supportPackageNotChosen.visible).ok();
  await t.expect(reviewModule.cancellationProtectionNotChosen.visible).ok();

  await t.click(reviewModule.editExtraProductsButton);
  await addNoBaggageService();
  await clickProceedToReviewButton();
  await scrollToElement(
    '[data-testid="travelerDetails-reviewModal-extraProducts-flexibleTicket"] button',
  );
  await t.click(reviewModule.addFlexTicketButton);

  await t.expect(reviewModule.baggageServiceProduct.visible).notOk();
  await t.expect(reviewModule.checkinBaggageChosen.visible).ok();
  await t.expect(reviewModule.flexTicketChosen.visible).ok();

  await scrollToElement('[data-testid="bookNowModal-button"]');
  await t.click(reviewModule.bookNowModalButton);
  // Verify trip information on payment page
  await t.click(paymentModule.tripDetailsToggleButton);
  await t.expect(paymentModule.tripBound.nth(0).innerText).contains(airport1);
  await t.expect(paymentModule.tripBound.nth(0).innerText).contains(airport2);
  await t.expect(paymentModule.tripBound.nth(1).innerText).contains(airport1);
  await t.expect(paymentModule.tripBound.nth(1).innerText).contains(airport2);
  await t.click(paymentModule.tripDetailsToggleButton);
  // Verify traveler information on payment page
  await t.click(paymentModule.travelerDetailsToggleButton);
  await t.expect(paymentModule.travelerContainer.innerText).contains(travelers[0].lastName);
  await t.expect(paymentModule.travelerContainer.innerText).contains(travelers[1].lastName);
  await t.click(paymentModule.travelerDetailsToggleButton);
  // Verify cart info on payment page
  if (await isDesktop()) {
    await openCartIfClosed();
    await t.expect(paymentModule.cartFlightContent.visible).ok('', { timeout: 90000 });
    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTrips.innerText).contains(airport1);
    await t.expect(paymentModule.cartTrips.innerText).contains(airport2);
    await t.expect(paymentModule.cartTravelerinfo.innerText).contains(travelerVerificationString);
    await t.expect(paymentModule.cartFlexTicketProduct.visible).ok();
    await t.expect(paymentModule.cartCheckInBaggageProduct.visible).ok();
  } else if ((await isMobile()) || (await isTablet())) {
    await toggleCart();
    await t.expect(paymentModule.cartFlightContentMobile.visible).ok('', { timeout: 90000 });
    await t.click(paymentModule.cartTravelerInfoButton);
    await t.expect(paymentModule.cartTripsMobile().innerText).contains(airport1);
    await t.expect(paymentModule.cartTripsMobile().innerText).contains(airport2);
    await t
      .expect(paymentModule.cartTravelerInfoMobile.innerText)
      .contains(travelerVerificationString);
    await t.expect(paymentModule.cartFlexTicketProductMobile().visible).ok();
    await t.expect(paymentModule.cartCheckInBaggageProductMobile().visible).ok();
    await toggleCart();
  }
  await payWithDummyBank();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageSupersaverSe);

  // Verify trip information on order page
  await t.expect(orderModule.tripSegment.nth(0).innerText).contains(airport1);
  await t.expect(orderModule.tripSegment.nth(0).innerText).contains(airport2);
  await t.expect(orderModule.tripSegment.nth(1).innerText).contains(airport1);
  await t.expect(orderModule.tripSegment.nth(1).innerText).contains(airport2);
  // Verify traveler information on payment page
  await t.expect(orderModule.travelerInfo.parent(1).innerText).contains(travelers[0].lastName);
  await t.expect(orderModule.travelerInfo.parent(1).innerText).contains(travelers[1].lastName);
  //  Verify order information
  await t.expect(orderModule.orderInfoTrip.visible).ok('', { timeout: 50000 });
  await t.expect(orderModule.orderInfoTrip.innerText).contains(airport1);
  await t.expect(orderModule.orderInfoTrip.innerText).contains(airport2);
  await t.expect(orderModule.travelerPriceInfo.innerText).contains(travelerVerificationString);
  await t.expect(orderModule.allProductsInOrder.count).eql(2);
  await t.expect(orderModule.cartCheckinBaggageProduct.visible).ok();
  await t.expect(orderModule.cartFlexTicketProduct().visible).ok();
});
