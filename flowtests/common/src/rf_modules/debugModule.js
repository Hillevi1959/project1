import { Selector } from 'testcafe';

export default {
  debugBar: Selector('[data-testid="devBar"]'),
  debugBarClosed: Selector('.devBarClosed'),
  debugBarOpen: Selector('.devBarOpen'),
  debugFilterButton: Selector('[data-testid="resultPage-debugTools-toggleButton-button"]'),
  debugFilterContent: Selector('[data-testid="resultPage-debugFilters-content"]'),
  enableDebug: Selector('#debug-link'),
  toggleDevBarButton: Selector('[data-testid="toggleDevBar"]'),
};
