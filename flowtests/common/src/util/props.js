import { Selector, t } from 'testcafe';
import config from '../../../frontE2E/testdata.json';
import edvinModule from '../rf_modules/edvinModule';
import { fetchUrl } from './clientFunction';
import { reloadWindow } from './common';

async function setProp(key, value) {
  await fetchUrl(`/ibemgr/test-prop.action?key=${key}&value=${value}`);
}

export default async function setProps(data) {
  await Object.entries(data).forEach(x => {
    const key = x[0];
    const value = x[1];
    setProp(key, value);
  });
  await reloadWindow();
}

export async function updatePropsInEdvin(site, propName, value, groupName) {
  // Selectors for setting properties
  const keyName = Selector('[name="keyName"]');
  const searchButton = Selector('[name="__submit"]');
  const groupNameInput = Selector('[name="groupName"]');
  const propInList = Selector('td').withText(propName);
  const keyValue = Selector('[name="keyvalue"]');
  const selectAllCheckboxes = Selector(
    '[title="Click to Select/Deselect all Checkboxes. Mouse over the Checkboxes with SHIFT to select, Mouse over and ALT to deselect."]',
  );
  const saveProp = Selector('[value="Save"]').nth(1);
  const reloadImmediatelyButton = Selector('[name="formButton"]');
  const cacheTriggerAlert = Selector('[role="alert"]');
  await t
    .navigateTo(`http://${site}${config.host}/edvin`)
    .typeText(edvinModule.userNameInput, 'autotest')
    .typeText(edvinModule.passwordInput, 'gurkburk')
    .click(edvinModule.logInButton)
    .navigateTo(
      `http://${site}${config.host}/edvin/dbproperty/DBPropertyValue.list.action?_s=true&search=false`,
    );

  // Search for prop
  await t
    .typeText(keyName, propName)
    .typeText(groupNameInput, groupName)
    .click(searchButton);
  // Change prop
  await t.click(propInList);
  if (await keyValue.checked) {
    if (value === 'false') {
      await t.click(keyValue);
      await t.click(saveProp);
    }
  } else if (!(await keyValue.checked)) {
    if (value === 'true') {
      await t.click(keyValue);
      await t.click(saveProp);
    }
    await t.navigateTo(
      `http://${site}${config.host}/edvin/cache/PendingCacheTriggers.list.action?_s=true`,
    );
    if (!(await cacheTriggerAlert.visible)) {
      await t.click(selectAllCheckboxes).click(reloadImmediatelyButton);
    }
  }
}
