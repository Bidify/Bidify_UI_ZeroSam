import { InjectedConnector } from "@web3-react/injected-connector";
import { supportedChainIds } from "./config";
// import { NetworkConnector } from '@web3-react/network-connector'

// const POLLING_INTERVAL = 12000
// const RPC_URLS = {
//   97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
// };

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds, //[4, 1987, 43114, 137, 100, 61, 9001, 1285, 56],
});

// export const network = new NetworkConnector({
//   urls: { 97: RPC_URLS[97] },
//   defaultChainId: 97
// })
