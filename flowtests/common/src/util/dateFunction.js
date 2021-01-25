export default function dateToYMD(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${String(y)}-${m <= 9 ? `0${m}` : m}-${d <= 9 ? `0${d}` : d}`;
}

export function dateToDDMMYYYY(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${d <= 9 ? `0${d}` : d}-${m <= 9 ? `0${m}` : m}-${String(y)}`;
}

function addDays(days) {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

export function getExpectedDate(addedMonths, day, tripType) {
  let now;
  if (tripType === 'one way trip' || tripType === 'multi trip') {
    now = addDays(7);
  } else {
    now = new Date();
  }
  const m = now.getMonth() + 1 + addedMonths;
  let d = now.setDate(day);
  d = now.getDate();
  const y = now.getFullYear();

  return `${String(y)}-${m <= 9 ? `0${m}` : m}-${d <= 9 ? `0${d}` : d}`;
}
