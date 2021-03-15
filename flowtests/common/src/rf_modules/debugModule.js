import { Selector } from 'testcafe';

export default {
  debugBar: Selector('[data-testid="devBar"]'),
  debugBarClosed: Selector('.closed'),
  debugBarOpen: Selector('.open'),
  debugFilterButton: Selector('[data-testid="resultPage-debugTools-toggleButton-button"]'),
  debugToolsButton: Selector('[data-testid="devBar-toggleButton-button"]').nth(1),
  debugOptionsButton: Selector('[data-testid="devBar-toggleButton-button"]').nth(0),
  enableDebug: Selector('#debug-link'),
};
