import { fetchUrl } from './clientFunction';
import { reloadWindow } from './common';

export default async function enableDebug() {
  await fetchUrl('/rpc.debug.enable.debug.do.action?enable=true');
  await reloadWindow();
}
