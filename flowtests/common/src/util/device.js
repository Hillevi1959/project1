import { ClientFunction } from 'testcafe';

const getWidth = ClientFunction(() => window.innerWidth);

export async function isMobile() {
  const width = await getWidth();
  return width < 768;
}

export async function isTablet() {
  const width = await getWidth();
  return width > 767 && width < 970;
}

export async function isDesktop() {
  const width = await getWidth();
  return width > 970;
}

export async function getWindowWidth() {
  return getWidth();
}
