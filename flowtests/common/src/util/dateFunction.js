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

export function getInputTripDate(days, dateFormat) {
  const now = new Date(Date.now());
  let date;

  const newDate = now.setMonth(now.getMonth() + 1);
  newDate.setDate(now.getDate() + days);
  if (dateFormat === 'DDMMYYYY') {
    date = dateToDDMMYYYY(now);
  } else {
    date = dateToYMD(now);
  }
  return date;
}
