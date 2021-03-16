import { Selector } from 'testcafe';

export default {
  debugBar: Selector('[data-testid="devBar"]'),
  debugBarClosed: Selector('.closed'),
  debugBarOpen: Selector('.open'),
  debugFilterButton: Selector('[data-testid="resultPage-debugTools-toggleButton-button"]'),
  debugFilterCloseButton: Selector('[data-testid="resultPage-debugTools-closeButton-button"]'),
  debugToolsButton: Selector('[data-testid="devBar-toggleButton-button"]').nth(1),
  debugToolsCloseButton: Selector('#dev-bar-main button'),
  debugOptionsButton: Selector('[data-testid="devBar-toggleButton-button"]').nth(0),
  debugOptionsCloseButton: Selector('#dev-bar-search button'),
  enableDebug: Selector('#debug-link'),
  searchCarrierDropdown: Selector('[data-testid="resultPage-debugTools-carrier-search-dropdown"]'),
};
