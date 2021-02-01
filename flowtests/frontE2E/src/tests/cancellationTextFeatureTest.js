import { Selector, t } from 'testcafe';
import { acceptCookies, getSiteUrl } from '../../../common/src/util/common';
import config from '../../testdata.json';
import { addNumberToTraveler, getFirstAdult } from '../../../common/src/util/travelerData';
import enableDebug from '../../../common/src/util/debug';
import { selectProvider } from '../../../common/src/util/debugOptions';
import {
  closeHeaderUrgencyBanner,
  enterFromCity,
  enterToCity,
  searchTrip,
  selectTravelers,
} from '../../../common/src/rf_pages/start';
import resultModule from '../../../common/src/rf_modules/resultModule';
import { selectTripButtonByIndex } from '../../../common/src/rf_pages/result';
import travelerDetailsModule from '../../../common/src/rf_modules/travelerDetailsModule';
import { addTravelerInformation, bookFlight } from '../../../common/src/rf_pages/travelerDetails';
import { addNoExtraProducts } from '../../../common/src/rf_pages/travelerDetailsProducts';
import paymentModule from '../../../common/src/rf_modules/paymentModule';
import startModule from '../../../common/src/rf_modules/startModule';
import setProps, { updatePropsInEdvin } from '../../../common/src/util/props';

const travelers = addNumberToTraveler([getFirstAdult()]);
const numberOfAdults = 1;

fixture('Conditional text key on payment page');

test.before(async () => {
  const props = {
    'BookingFlow.FreeCancellation.Enable': false,
  };
  const url = getSiteUrl('gotogate-us-kayak', config.host);
  await updatePropsInEdvin(
    'gotogate-us',
    'BookingFlow.FreeCancellationDaysAhead.Enabled@kayak',
    'true',
    'gotogate_us',
  );
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Text verification for Kayak partner, departure day after limit of days ahead', async () => {
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'Paris', 'New York', 'ECONOMY', [11, 24]);

  await t.expect(resultModule.freeCancellationDaysAheadText.visible).ok();

  await selectTripButtonByIndex(0);

  await t.expect(travelerDetailsModule.freeCancellationDaysAheadText.visible).ok();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();

  await t.expect(paymentModule.freeCancellationDaysAheadText.visible).ok();
});

test.before(async () => {
  const props = {
    'BookingFlow.FreeCancellation.Enable': false,
  };
  const url = getSiteUrl('gotogate-us-kayak', config.host);
  await updatePropsInEdvin(
    'gotogate-us',
    'BookingFlow.FreeCancellationDaysAhead.Enabled@kayak',
    'true',
    'gotogate_us',
  );
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Text verification for Kayak partner, departure day before limit of days ahead', async () => {
  await t.click(startModule.oneWayTrip);
  await enterFromCity('Paris');
  await enterToCity('New York');
  await selectTravelers(numberOfAdults, 0, 0);
  await t.click(startModule.departureDate);
  if (!(await Selector('.DayPicker-Day--today').exists)) {
    await t.click(Selector('[data-testid="searchForm-previousMonth-input"]'));
  }
  await t.click(Selector('.DayPicker-Day--today'));
  await t.click(startModule.searchFlight);

  await t.expect(resultModule.freeCancellationDaysAheadText.exists).notOk();

  await selectTripButtonByIndex(0);

  await t.expect(travelerDetailsModule.freeCancellationDaysAheadText.exists).notOk();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();

  await t.expect(paymentModule.freeCancellationDaysAheadText.exists).notOk();
});

test.before(async () => {
  const props = {
    'BookingFlow.FreeCancellation.Enable': false,
  };
  const url = getSiteUrl('gotogate-us-kayak', config.host);
  await updatePropsInEdvin(
    'gotogate-us',
    'BookingFlow.FreeCancellationDaysAhead.Enabled@kayak',
    'false',
    'gotogate_us',
  );
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('No text visible for Kayak partner', async () => {
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'Paris', 'New York', 'ECONOMY', [11, 24]);

  await t.expect(resultModule.freeCancellationDaysAheadText.exists).notOk();

  await selectTripButtonByIndex(0);

  await t.expect(travelerDetailsModule.freeCancellationDaysAheadText.exista).notOk();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();

  await t.expect(paymentModule.freeCancellationDaysAheadText.exists).notOk();
});

test.before(async () => {
  const props = {
    'BookingFlow.FreeCancellation.Enable': true,
  };
  const url = getSiteUrl('gotogate-us', config.host);
  await updatePropsInEdvin(
    'gotogate-us',
    'BookingFlow.FreeCancellationDaysAhead.Enabled@kayak',
    'true',
    'gotogate_us',
  );
  await t.navigateTo(url);
  await enableDebug();
  await acceptCookies();
  await selectProvider('IbeGDSDummy');
  await setProps(props);
  await closeHeaderUrgencyBanner();
})('Text verification on US site without Kayak partner', async () => {
  await searchTrip(numberOfAdults, 0, 0, 'return trip', 'Paris', 'New York', 'ECONOMY', [11, 24]);

  await t.expect(resultModule.freeCancellation.visible).ok();

  await selectTripButtonByIndex(0);

  await t.expect(travelerDetailsModule.freeCancellation.visible).ok();

  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults);
  await bookFlight();

  await t.expect(paymentModule.freeCancellation.visible).ok();
});
