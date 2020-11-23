export const getPriceFromText = (priceText, currencyText = ' SEK') => {
  const indexStart = 1;
  const indexEnd = priceText.search(currencyText);
  const price = priceText.substring(indexStart, indexEnd);
  return parseInt(price.replace(/\s+/g, ''), 10);
};
