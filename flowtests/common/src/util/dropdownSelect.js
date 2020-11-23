import { Selector, t } from 'testcafe';

async function selectByIndex(index) {
  await t.expect(Selector('.etiOption').exists).ok('', { timeout: 50000 });
  await t.click(Selector('.etiOption').nth(index));
}

async function selectByText(selection) {
  await t.expect(Selector('.etiOption').exists).ok('', { timeout: 50000 });
  await t.click(Selector('.etiOption').withText(selection));
}

export async function openDropdown(selector) {
  await t.hover(selector, { offsetX: 0, offsetY: 100 });
  await t.click(selector);
  await t.pressKey('down');
}

export async function dropdownSelect(selector, selection) {
  const normalizedSelector = typeof selector === 'string' ? Selector(selector) : selector;
  await openDropdown(normalizedSelector);

  if (selection === parseInt(selection, 10)) {
    await selectByIndex(selection);
  } else {
    await selectByText(selection);
  }
}
