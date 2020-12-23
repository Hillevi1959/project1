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

export function getInputTripDate(months, dateFormat) {
  const now = new Date(Date.now());
  const m = now.setMonth() + months;
  const y = now.getFullYear();

  if (dateFormat === 'DDMMYYYY') {
    return `${m <= 9 ? `0${m}` : m}-${String(y)}`;
  }
  return `${String(y)}-${m <= 9 ? `0${m}` : m}`;
}
