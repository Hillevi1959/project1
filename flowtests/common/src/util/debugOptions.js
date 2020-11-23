import { ClientFunction, t } from 'testcafe';
import { fetchUrl } from './clientFunction';

export async function setIBEDummyPaymentBankOn() {
  await fetchUrl(
    `/ibemgr/debuginfo?SetClientDebugMode=true&override=true&self=true&dbgPropAdd=IBE_DUMMY_PAYMENT`,
  );
}

export async function setChangeFlightPriceLargeIncrease() {
  await fetchUrl(
    `/ibemgr/debuginfo?SetClientDebugMode=true&override=true&self=true&dbgPropAdd=CHANGE_FLIGHT_PRICE_LARGE_INCREASE`,
  );
}

const fetchDebugData = ClientFunction(() =>
  fetch('/rpc.debug.get.properties.do.action').then(response => response.json()),
);
export async function assertProviderIsSelected(provider) {
  const response = await fetchDebugData();
  const systemFromServer = response.model.airSystems.find(system => system.name === provider);
  await t.expect(systemFromServer.enabled).eql(true, `System ${provider} is not enabled`);
}

export async function selectProvider(provider) {
  const providerMap = {
    IbeDummy: 110,
    IbeGDSDummy: 111,
    Amadeus: 5,
    Sabre: 1,
    Travelfusion: 59,
    Tripstack: 79,
    Farelogix: 39,
  };
  const providerId = providerMap[provider];
  if (providerId) {
    await fetchUrl(
      `/rpc.debug.set.properties.do.action?key=dbg_onlyRsrvSys&value=${providerId}&enabled=true`,
    );
  } else {
    await t.expect(provider).eql('2', `Trying to use unsuported provider ${provider}`);
  }
  await assertProviderIsSelected(provider);
}

export async function setOwcOnly() {
  await fetchUrl(
    `/rpc.debug.set.properties.do.action?key=dbg_ac_ssi&value=FORCE_OWC_ONLY&enabled=true`,
  );
}
