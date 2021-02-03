export const getPriceFromText = (priceText, currencyText = ' SEK') => {
  const indexStart = 1;
  const indexEnd = priceText.search(currencyText);
  const price = priceText.substring(indexStart, indexEnd);
  return parseInt(price.replace(/\s+/g, ''), 10);
};

export const getVoucherPricePound = priceText => {
  const stringPrice = priceText.substring(priceText.indexOf('£') + 1);
  return parseFloat(stringPrice.replace(',', ''), 10);
};

export const convertTextPricePoundToNumber = priceText => {
  const stringPrice = priceText.substring(priceText.indexOf('£') + 1);
  return parseFloat(stringPrice.replace(',', ''), 10);
};

export const removeUnicodeFromTextPrice = stringPrice =>
  stringPrice.slice(1, stringPrice.length - 1);
