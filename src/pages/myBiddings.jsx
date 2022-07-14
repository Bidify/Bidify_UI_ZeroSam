import React, { useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { FetchWrapper } from "use-nft";
import { ethers, Contract } from "ethers";
import Web3 from "web3";

//IMPORTING STYLESHEET

import "../styles/patterns/liveauction.scss";

//IMPORTING PATTERNS

import Card from "../patterns/card";
import ScreenTemplate from "../patterns/screenTemplate";
import NoArtifacts from "../patterns/noArtifacts";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

//IMPORTING UTILITY PACKAGES

import { BIDIFY, URLS } from "../utils/config";
import { getListing } from "../utils/Bidify";

const MyBiddings = () => {
  //INITIALIZING HOOKS

  const { userState, userDispatch } = useContext(UserContext);
  const { active, account, chainId } = useWeb3React();

  //HANDLING METHODS

  useEffect(() => {
    if (!userState?.isLiveAuctionFetched) getLists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, userState]);

  const getLists = async () => {
    //const Bidify = new web3.eth.Contract(BIDIFY.abi, BIDIFY.address);
    //const totalAuction = await Bidify.methods.totalListings().call();

    const totalAuction = await getLogs();
    let Lists = [];
    for (let i = 0; i < totalAuction; i++) {
      const result = await getListing(i.toString());
      Lists[i] = result;
    }
    getDetails(Lists);
  };

  const getLogs = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic0 =
      "0x5424fbee1c8f403254bd729bf71af07aa944120992dfa4f67cd0e7846ef7b8de";
    const logs = await web3.eth.getPastLogs({
      fromBlock: "earliest",
      toBlock: "latest",
      address: BIDIFY.address[chainId],
      topics: [topic0],
    });

    return logs.length;
  };

  const getFetchValues = async (val) => {
    let provider;
    switch (chainId) {
      case 1:
        provider = new ethers.providers.InfuraProvider(
          "mainnet",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 3:
        provider = new ethers.providers.InfuraProvider(
          "ropsten",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 4:
        provider = new ethers.providers.InfuraProvider(
          "rinkeby",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 5:
        provider = new ethers.providers.InfuraProvider(
          "goerli",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 42:
        provider = new ethers.providers.InfuraProvider(
          "kovan",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 1987:
        provider = new ethers.providers.JsonRpcProvider("https://lb.rpc.egem.io")
        break;
      case 43113:
        provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
        break;
      case 43114:
        provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
        break;
      case 137:
        provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
        break;
      case 80001:
        provider = new ethers.providers.JsonRpcProvider("https://matic-testnet-archive-rpc.bwarelabs.com")
        break;
      default:
        console.log("select valid chain");
    }

    const ethersConfig = {
      ethers: { Contract },
      provider: provider,
    };

    const fetcher = ["ethers", ethersConfig];

    function ipfsUrl(cid, path = "") {
      return `https://dweb.link/ipfs/${cid}${path}`;
    }

    function imageurl(url) {
      // const string = url;
      const check = url.substr(16, 4);
      if(url.includes('ipfs://')) return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
      if (check === "ipfs") {
        const manipulated = url.substr(16, 16 + 45);
        return "https://dweb.link/" + manipulated;
      } else {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      }
    }

    // function jsonurl(url) {
    //   return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    // }

    const fetchWrapper = new FetchWrapper(fetcher, {
      jsonProxy: (url) => {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      },
      imageProxy: (url) => {
        return imageurl(url);
      },
      ipfsUrl: (cid, path) => {
        return ipfsUrl(cid, path);
      },
    });
    const result = await fetchWrapper.fetchNft(val?.platform, val?.token);
    const finalResult = {
      ...result,
      platform: val?.platform,
      token: val?.token,
      ...val,
    };
    return finalResult;
  };

  const getDetails = async (lists) => {
    const unsolvedPromises = lists.map((val) => getFetchValues(val));
    const results = await Promise.all(unsolvedPromises);
    const filteredData = results.filter((val) => val.paidOut !== true);
    const userBiddings = results.filter((value) =>
      value.bids.some(
        (val) =>
          val.bidder?.toLocaleLowerCase() === account?.toLocaleLowerCase()
      )
    );
    userDispatch({
      type: "LIVE_AUCTION_NFT",
      payload: { results: filteredData, userBiddings, isFetched: true },
    });
  };

  const renderCards = (
    <>
      { !active ? <NoArtifacts title="Bidify is not connected to Ethereum." /> : userState?.userBiddings?.length > 0 ? (
        <div className="live_auction_card_wrapper">
          {userState?.userBiddings?.map((lists, index) => {
            return <Card {...lists} key={index} />;
          })}
        </div>
      ) : (
        <NoArtifacts
          title="This wallet has not bid on any NFTs using Bidify yet"
          variant="mybiddings"
        />
      )}
    </>
  );

  return <ScreenTemplate>{renderCards}</ScreenTemplate>;
};

export default MyBiddings;
