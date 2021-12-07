import { FetchWrapper } from "use-nft";
import { ethers, Contract } from "ethers";

export const getNfts = async (platform, token) => {
  let provider;
  provider = new ethers.providers.InfuraProvider(
    "mainnet",
    "0c8149f8e63b4b818d441dd7f74ab618"
  );

  const ethersConfig = {
    ethers: { Contract },
    provider: provider,
  };
  const fetcher = ["ethers", ethersConfig];

  function ipfsUrl(cid, path = "") {
    return `https://dweb.link/ipfs/${cid}${path}`;
  }

  const fetchWrapper = new FetchWrapper(fetcher, {
    jsonProxy: (url) => {
      return url;
    },
    ipfsUrl: (cid, path) => {
      return ipfsUrl(cid, path);
    },
  });

  const result = await fetchWrapper.fetchNft(platform, token).catch((err) => {
    console.log(err);
  });

  return result;
};
