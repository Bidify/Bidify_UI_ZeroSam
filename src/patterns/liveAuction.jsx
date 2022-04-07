import React, { useEffect, useContext, useState } from "react";
import { FetchWrapper } from "use-nft";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

//IMPORTING STYLESHEET

import "../styles/patterns/liveauction.scss";

//IMPORTING COMPONENTS

import Card from "./card";
import { Text } from "../components";
import NoArtifacts from "./noArtifacts";
import Loader from "./loader";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

//IMPORTING UTILITY PACKAGES

import { BIDIFY, URLS, baseUrl, snowApi, getLogUrl } from "../utils/config";
import { getDecimals, getListing, unatomic } from "../utils/Bidify";

import axios from "axios";

const LiveAuction = () => {
  //INITIALIZING HOOKS
  const { userState, userDispatch } = useContext(UserContext);
  const { active, account, chainId, library } = useWeb3React()

  const [update, setUpdate] = useState([])
  //HANDLING METHODS
  const getAuctions = () => {
    axios.get(`${baseUrl}/auctions`, { params: { chainId: chainId } })
      .then(response => {
        const results = response.data
        console.log("database", results)
        // const filteredData = results.filter((val) => val.paidOut !== true);
        const userBiddings = results.filter((value) =>
          value.bids.some(
            (val) =>
              val.bidder?.toLocaleLowerCase() === account?.toLocaleLowerCase()
          )
        );
        userDispatch({
          type: "LIVE_AUCTION_NFT",
          payload: { results: results, userBiddings, isFetched: true },
        });
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  useEffect(() => {
    if (!active) return
    // getLists();
    userDispatch({
      type: "LIVE_AUCTION_NFT",
      payload: { results: undefined },
    });
    getAuctions()
  }, [active, chainId]);

  const getLists = async () => {
    userDispatch({
      type: "LIVE_AUCTION_NFT",
      payload: { results: undefined },
    });
    //const Bidify = new web3.eth.Contract(BIDIFY.abi, BIDIFY.address);
    //const totalAuction = await Bidify.methods.totalListings().call();

    const totalAuction = await getLogs();
    let Lists = [];
    // console.log("totalAuction", totalAuction)
    const pLists = []
    for (let i = 0; i < totalAuction; i++) {
      let result
      if(chainId === 43114 || chainId === 137) result = getListingDetail(i)
      else result = getListing(i.toString());
      pLists[i] = result
    }
    
    Lists = await Promise.all(pLists);
    console.log("blockchain data", Lists)
    getDetails(Lists);
  };

  const getListingDetail = async (id) => {
    const bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
    const raw = await bidify.getListing(id.toString())
    const nullIfZeroAddress = (value) => {
      if (value === "0x0000000000000000000000000000000000000000") {
        return null;
      }
      return value;
    };

    let currency = nullIfZeroAddress(raw.currency);

    let highBidder = nullIfZeroAddress(raw.highBidder);
    let currentBid = raw.price;
    let nextBid = await bidify.getNextBid(id.toString());
    let decimals = await getDecimals(currency);
    // console.log("compareing", currentBid.toString() === nextBid.toString(), currentBid, nextBid)
    if (currentBid.toString() === nextBid.toString()) {
      currentBid = null;
    } else {
      currentBid = unatomic(currentBid.toString(), decimals);
    }

    let referrer = nullIfZeroAddress(raw.referrer);
    let marketplace = nullIfZeroAddress(raw.marketplace);

    let bids = [];
    const web3 = new Web3(window.ethereum)
    const topic1 = "0x" + new web3.utils.BN(id).toString("hex").padStart(64, "0");
    const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&topic0=0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914&topic0_1_opr=and&topic1=${topic1}&apikey=${snowApi[chainId]}`)
    const logs = ret.data.result
    for (let bid of logs) {
      bids.push({
        bidder: "0x" + bid.topics[2].substr(-40),
        price: unatomic(
          new web3.utils.BN(bid.data.substr(2), "hex").toString(),
          decimals
        ),
      });
    }
    return {
      id,
      creator: raw.creator,
      currency,
      platform: raw.platform,
      token: raw.token.toString(),

      highBidder,
      currentBid,
      nextBid: unatomic(nextBid.toString(), decimals),

      referrer,
      allowMarketplace: raw.allowMarketplace,
      marketplace,

      endTime: raw.endTime.toString(),
      paidOut: raw.paidOut,
      isERC721: raw.isERC721,

      bids,
    };
  }

  const getLogs = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic0 =
      "0xb8160cd5a5d5f01ed9352faa7324b9df403f9c15c1ed9ba8cb8ee8ddbd50b748";
    let logs = [];
    try {
      if(chainId === 43114 || chainId === 137) {
        const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&address=${BIDIFY.address[chainId]}&topic0=${topic0}&apikey=${snowApi[chainId]}`)
        logs = ret.data.result
      }
      else logs = await web3.eth.getPastLogs({
        fromBlock: "earliest",
        toBlock: "latest",
        address: BIDIFY.address[chainId],
        topics: [topic0],
      });
    } catch (e) {
      console.log(e.message)
    }

    let totalLists = 0;
    for (let log of logs) {
      totalLists++;
    }

    return totalLists;
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
      case 80001:
        provider = new ethers.providers.JsonRpcProvider("https://matic-testnet-archive-rpc.bwarelabs.com")
        break;
      case 137:
        provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
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
      const string = url;
      const check = url.substr(16, 4);
      if (check === "ipfs") {
        const manipulated = url.substr(16, 16 + 45);
        return "https://dweb.link/" + manipulated;
      } else {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      }
    }
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

    const result = await fetchWrapper
      .fetchNft(val?.platform, val?.token)
      .catch((err) => {
        console.log("fetchWrapper error", err.message);
      });
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
    setUpdate(results.map(item => { return { ...item, network: chainId } }))
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

  // const renderNoMathches = (
  //   <div className="loader">
  //     <div style={{ display: "flex", alignItems: "center", gridGap: "1em" }}>
  //       <img
  //         src={search}
  //         alt="loader"
  //         width={24}
  //         style={{ filter: "greyscale(1)" }}
  //       />{" "}
  //       <Text>No matches found</Text>
  //     </div>
  //   </div>
  // );
  const handleUpdate = async () => {
    if (update.length === 0) return
    const res = await axios.post(`${baseUrl}/admin`, update)
  }
  const renderCards = (
    <>
      {account === "0x484D53603331e4030439c3C58f51f9d433Df1F39" && <button onClick={handleUpdate}>update database</button>}
      {userState?.searchResults?.length === undefined ? (
        <div className="live_auction_card_wrapper">
          {userState?.liveAuctions?.map((lists, index) => {
            return <Card {...lists} getLists={getAuctions} key={index} getFetchValues={getFetchValues} />;
          })}
        </div>
      ) : userState?.searchResults?.length === 0 ? (
        <div className="center">
          <Text>No matches found</Text>
        </div>
      ) : (
        <div className="live_auction_card_wrapper">
          {userState?.searchResults?.map((lists, index) => {
            return <Card {...lists} getLists={getAuctions} key={index} getFetchValues={getFetchValues} />;
          })}
        </div>
      )}
    </>
  );

  return (
    <>
      {!active ? <NoArtifacts title="Bidify is not connected to Ethereum." /> : userState?.liveAuctions ? (
        userState?.liveAuctions?.length > 0 ? (
          <div className="live_auctions">{renderCards}</div>
        ) : (
          <NoArtifacts />
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default LiveAuction;
