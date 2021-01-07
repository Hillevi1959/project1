import { searchAndSelectTrip } from '../rf_pages/start';
import { addTravelerInformation, bookFlight } from '../rf_pages/travelerDetails';
import { addNoExtraProducts } from '../rf_pages/travelerDetailsProducts';
import { closeSeatMapModal } from '../rf_pages/seatMap';
import { payWithCreditCard, payWithDummyBank } from '../rf_pages/payment';

export async function createOrderWithNoProducts(
  numberOfAdults,
  numberOfChildren,
  numberOfInfants,
  travelers,
  tripType,
  origin,
  destination,
  paymentMethod,
  tripSelection,
  day,
) {
  await searchAndSelectTrip(
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    tripType,
    origin,
    destination,
    tripSelection,
    day,
  );
  await addTravelerInformation(travelers);
  await addNoExtraProducts(numberOfAdults + numberOfChildren);
  await bookFlight();
  await closeSeatMapModal();
  if (paymentMethod === 'CARD') {
    await payWithCreditCard();
  } else if (paymentMethod === 'BANK') {
    await payWithDummyBank(travelers[0]);
  }
}
