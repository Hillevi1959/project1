/* eslint-disable no-await-in-loop */
import { t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import {
  addNumberToTraveler,
  getFirstAdult,
  getFirstChild,
  getFirstInfant,
  getSecondAdult,
} from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import setProps from '../../../common/src/util/props';
import { closeHeaderUrgencyBanner, searchAndSelectTrip } from '../../../common/src/rf_pages/start';
import startModule from '../../../common/src/rf_modules/startModule';
import {
  addPassportInformation,
  addTravelerInformation,
  bookFlight,
} from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import { addCheckoutData, payWithCreditCard } from '../../../common/src/rf_pages/payment';
import { messageUk, waitForOrderPageToLoad } from '../../../common/src/rf_pages/order';
import orderModule from '../../../common/src/rf_modules/orderModule';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { closeSeatMapModal } from '../../../common/src/rf_pages/seatMap';

const travelers = addNumberToTraveler([
  getFirstAdult(),
  getSecondAdult(),
  getFirstChild(),
  getFirstInfant(),
]);
const numberOfAdults = 2;
const numberOfChildren = 1;
const numberOfInfants = 1;

fixture('Verify expirydate for passport for different markets');

test.before(async () => {
  const url = getSiteUrl('gotogate-ru', config.host);
  const props = {
    'IbeClient.TravelerDetails.Modal': 'SEATMAP',
    'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
    'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
    'Payment.FraudAssessment.Accertify.ShadowMode': true,
    'Payment.provider.creditcard': 'Checkout',
    'GDSSecureFlightConfig.TravelDocumentExpiryDateOptional.OriginDestinations':
      'RU-RU, RU-BY, RU-KZ',
  };
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Expiry date for passport is optional', async () => {
  await t.click(startModule.directFlightBox);
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'Moscow',
    'Aktau',
    'ECONOMY',
    [11, 24],
  );

  await addTravelerInformation(travelers, 'DDMMYYYY');
  await addPassportInformation(travelers, false, 'DDMMYYYY');
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
});

test.before(async () => {
  const url = getSiteUrl('gotogate-ru', config.host);
  const props = {
    'IbeClient.TravelerDetails.Modal': 'SEATMAP',
    'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
    'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
    'Payment.FraudAssessment.Accertify.ShadowMode': true,
    'Payment.provider.creditcard': 'Checkout',
    'GDSSecureFlightConfig.TravelDocumentExpiryDateOptional.OriginDestinations':
      'RU-RU, RU-BY, RU-KZ',
  };
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Expiry date for passport is required', async () => {
  await t.click(startModule.directFlightBox);
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'Moscow',
    'GOT',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers, 'DDMMYYYY');
  await addPassportInformation(travelers, false, 'DDMMYYYY');
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();

  for (const traveler of travelers) {
    await t
      .expect(travelerDetailsModule.expiryDateError(traveler.nr).innerText)
      .contains('Your passport expiry date is required');
  }

  await addPassportInformation(travelers, true, 'DDMMYYYY');
  await bookFlight();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
});

test.before(async () => {
  const props = {
    'IbeClient.TravelerDetails.Modal': 'SEATMAP',
    'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
    'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
    'Payment.FraudAssessment.Accertify.ShadowMode': true,
    'Payment.provider.creditcard': 'Checkout',
    'GDSSecureFlightConfig.PassportRequiredWhenEnteringDOB': true,
  };
  const url = getSiteUrl('gotogate-uk', config.host);
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Expiry date for passport is required on other market', async () => {
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'London',
    'New York',
    'ECONOMY',
    [11, 24],
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();

  for (const traveler of travelers) {
    await t
      .expect(travelerDetailsModule.expiryDateError(traveler.nr).nth(1).innerText)
      .match(/Your passport expiry date is required/);
  }

  await addPassportInformation(travelers, true);
  await bookFlight();
  await closeSeatMapModal();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
});

test.before(async () => {
  const props = {
    'IbeClient.TravelerDetails.Modal': 'SEATMAP',
    'IbeClient.SeatMap.Segment.Navigation.Manual.Enabled': true,
    'IbeClient.SeatMap.Footer.CancelButton.Disabled': true,
    'Payment.FraudAssessment.Accertify.ShadowMode': true,
    'Payment.provider.creditcard': 'Checkout',
    'GDSSecureFlightConfig.PassportRequiredWhenEnteringDOB': true,
  };
  const url = getSiteUrl('gotogate-uk', config.host);
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Passport fields not visible on trip within Europe', async () => {
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    'return trip',
    'London',
    'Amsterdam',
    'ECONOMY',
    [11, 24],
  );

  for (const traveler of travelers) {
    await t.expect(travelerDetailsModule.passportInformation(traveler.nr).exists).notOk();
  }

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();
  await payWithCreditCard();
  await addCheckoutData();
  await waitForOrderPageToLoad();
  await t.expect(orderModule.infoTextOrderPage.innerText).contains(messageUk);
});
