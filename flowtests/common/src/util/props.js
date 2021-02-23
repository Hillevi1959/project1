import { t } from 'testcafe';
import config from '../../../frontE2E/testdata.json';
import edvinModule from '../rf_modules/edvinModule';
import { logInToEdvin } from '../rf_pages/edvin';
import { fetchUrl } from './clientFunction';
import { reloadWindow } from './common';

async function setProp(key, value) {
  await fetchUrl(`/ibemgr/test-prop.action?key=${key}&value=${value}`);
}

export async function reloadCacheTriggers(site) {
  await t.navigateTo(
    `http://${site}${config.host}/edvin/cache/PendingCacheTriggers.list.action?_s=true`,
  );
  if (!(await edvinModule.cacheTriggerAlert.visible)) {
    await t.click(edvinModule.selectAllCheckboxes).click(edvinModule.reloadImmediatelyButton);
  }
}

export default async function setProps(data) {
  await Object.entries(data).forEach(x => {
    const key = x[0];
    const value = x[1];
    setProp(key, value);
  });
  await reloadWindow();
}

export async function addNewPropInEdvin(site, propName, value, groupName) {
  await logInToEdvin(`http://${site}${config.host}/edvin`);
  await t.navigateTo(
    `http://${site}${config.host}/edvin/dbproperty/DBPropertyValue.list.action?_s=true&search=false`,
  );
  // Search for prop
  await t
    .typeText(edvinModule.keyName, propName)
    .typeText(edvinModule.groupNameInput, groupName)
    .click(edvinModule.searchButton);
  if (await edvinModule.noPropFoundAlert.visible) {
    await t
      .typeText(edvinModule.valueInput, value)
      .click(edvinModule.addPropertyCheckbox(''))
      .click(edvinModule.searchButton);
  }
  await reloadCacheTriggers(site);
}

export async function updatePropsInEdvin(site, propName, value, groupName) {
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
    .typeText(edvinModule.keyName, propName)
    .typeText(edvinModule.groupNameInput, groupName)
    .click(edvinModule.searchButton);
  // Change prop
  await t.click(edvinModule.propInList(propName));
  if (await edvinModule.keyValue.checked) {
    if (value === 'false') {
      await t.click(edvinModule.keyValue);
      await t.click(edvinModule.saveProp);
    }
  } else if (!(await edvinModule.keyValue.checked)) {
    if (value === 'true') {
      await t.click(edvinModule.keyValue);
      await t.click(edvinModule.saveProp);
    }
  }
  await reloadCacheTriggers(site);
}
