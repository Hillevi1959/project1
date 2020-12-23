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

export function getDateNow() {
  const now = new Date(Date.now());
  const m = now.getMonth() + 1;
  const y = now.getFullYear();

  return `${String(y)}-${m <= 9 ? `0${m}` : m}`;
}
