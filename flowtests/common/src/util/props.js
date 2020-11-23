import { reloadWindow } from './common';
import { fetchUrl } from './clientFunction';

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
