import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { LiveAuctionModal } from "./modal";
import Prompt from "./prompt";

//IMPORTING MEDIA ASSETS

import lock from "../assets/icons/lock.svg";

//IMPORTING UTILITY PACKGAES

import { getListing, getDecimals, unatomic, atomic } from "../utils/Bidify";
import { getSymbol } from "../utils/getCurrencySymbol";
import Web3 from "web3";
import { baseUrl, BIDIFY, URLS, snowApi, getLogUrl } from "../utils/config";
import axios from "axios";
import { ethers } from "ethers"

const Card = (props) => {
  const { name, creator, image, currentBid, endTime, id, currency, getLists, highBidder, getFetchValues } =
    props;
  // console.log(props)
  const { account, chainId, library } = useWeb3React();
  const history = useHistory();

  const isUser = account?.toLocaleLowerCase() === creator?.toLocaleLowerCase();
  const isHighBidder = account?.toLocaleLowerCase() === highBidder?.toLocaleLowerCase();
  const [isModal, setIsModal] = useState(false);
  const [processContent, setProcessContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isVideo, setIsVideo] = useState(false);
  const [symbol, setSymbol] = useState('');

  // useEffect(() => {
  //   if (isSuccess) getLists();

  //   return () => setIsSuccess(false);
  // }, [isSuccess]);

  useEffect(async () => {
    if (currency === "0x0000000000000000000000000000000000000000" || !currency) {
      switch (chainId) {
        case 43113: case 43114:
          setSymbol("AVAX")
          break
        case 137: case 80001:
          setSymbol("MATIC")
          break
        case 1987:
          setSymbol("EGEM")
          break
        default:
          setSymbol("ETH")
          break
      }
      return
    }
    const res = await getSymbol(currency);
    setSymbol(res);
  }, []);

  const handleAbort = () => {
    setIsSuccess(false)
    getLists()
  }
  const handleFinisheAuction = async () => {
    setIsLoading(true);
    try {
      await new new Web3(window.ethereum).eth.Contract(
        BIDIFY.abi,
        BIDIFY.address[chainId]
      ).methods
        .finish(id.toString())
        .send({ from: account });
      const updateData = await getDetailFromId(id);
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const handleBidMethod = async (amount) => {
    // const updateData = await getDetailFromId(id);
    // await axios.put(`${baseUrl}/auctions/${id}`, updateData)
    // return;
    setIsModal(false);
    setIsLoading(true);
    setProcessContent(
      "Please allow https://Bidify.org permission within your wallet when prompted there will be a small fee for this"
    );
    try {
      await signBid(id, amount)
      setProcessContent(
        "Confirm the second transaction of your bid amount, there will be a small network fee for this."
      );
      await bid(id, amount);
      while(account !== (await getDetailFromId(id)).highBidder) {
        console.log("in while loop")
      }
      console.log("out of loop")
      const updateData = await getDetailFromId(id);
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      if (error === "low_balance") {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(
          "Check your balance.your balance is low to bid for this NFT"
        );
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      } else {
        setIsLoading(false);
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  };
  const bid = async (id, amount) => {
    let currency
    if(chainId === 137 || chainId === 43114) currency = (await getListingDetail(id)).currency;
    else currency = (await getListing(id.toString())).currency
    let decimals = await getDecimals(currency)
    const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
    const from = account
    // return console.log("handle bid", id, atomic(amount, decimals).toString())
    // console.log("amount", atomic(amount, decimals).toString())
    if (currency) {
      const tx = await Bidify
        .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString())
      await tx.wait()
    } else {
      const tx = await Bidify
        .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), {
          from: from,
          value: atomic(amount, decimals).toString(),
        })
      await tx.wait()
    }
  }
  const signBid = async (id, amount) => {
    // return;
    const from = account;
    const chain_id = chainId;
    let currency 
    if(chainId === 137 || chainId === 43114) currency = (await getListingDetail(id)).currency;
    else currency = (await getListing(id.toString())).currency
    let balance;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    const web3 = new Web3(window.ethereum)
    if (!currency) {
      balance = await web3.eth.getBalance(from)
      balance = web3.utils.fromWei(balance)
    }
    else {
      const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
      const erc20 = new ethers.Contract(currency, BIT.abi, library.getSigner());
      const decimals = await getDecimals(currency);
      balance = unatomic(
        await erc20.balanceOf(from),
        decimals
      );
      let allowance = await erc20.allowance(from, BIDIFY.address[chain_id])
      // console.log("allowence", Number(allowance));
      if (Number(amount) >= Number(allowance)) {
        const tx = await erc20
          .approve(Bidify._address, atomic(balance, decimals))
        await tx.wait()
      }
    }

    if (Number(balance) < Number(amount)) {
      throw "low_balance";
    }
  }
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
    let nextBid = await bidify.getNextBid(id);
    let decimals = await getDecimals(currency);
    if (currentBid === nextBid) {
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
  const getDetailFromId = async (id) => {
    let detail
    if (chainId === 43114 || chainId === 137) {
      detail = await getListingDetail(id)
    }
    else detail = await getListing(id)
    const fetchedValue = await getFetchValues(detail)
    return { ...fetchedValue, network: chainId }

  }
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <div className="card_content_details">
            <div className="block_left">
              {
                currentBid ?
                  <Text variant="primary" style={{ color: "#F79420" }}>
                    Sold out for {currentBid} {symbol}
                  </Text> :
                  <Text style={{ fontSize: 12 }}>Not sold out</Text>
              }
            </div>
          </div>
          {/* {isUser ? ( */}
          <Button
            variant="secondary"
            // style={{ pointerEvents: !isUser && "none" }}
            onClick={() => handleFinisheAuction()}
          >
            Finish auction
          </Button>
          {/* ) : ( */}
          {/* <p></p> */}
          {/* )} */}
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <div className="card_content_details">
            <div className="block_left">
              <Text variant="primary" style={{ color: "#F79420" }}>
                {currentBid ? currentBid : 0} {symbol}
              </Text>
              <Text style={{ fontSize: 12 }}>Current Bid</Text>
            </div>
            <div className="block_right">
              <Text variant="primary" style={{ color: "#FB5050" }}>
                {days} : {hours} : {minutes} : {seconds}
              </Text>
              <Text style={{ fontSize: 12 }}>Bidding Ends In</Text>
            </div>
          </div>
          <Button
            variant="secondary"
            style={{ pointerEvents: (isUser || isHighBidder) && "none" }}
            onClick={isUser ? null : () => setIsModal(true)}
          >
            {isUser ? (
              <img src={lock} alt="lock" width={14} />
            ) : (
              !isHighBidder ? "Place Your Bid" : "You are the highest bidder"
            )}
          </Button>
        </>
      );
    }
  };

  const renderImage = (
    <div
      className="card_image cursor"
      onClick={() => history.push(`/nft_details/${id}`)}
    >
      {isVideo ? (
        <video controls loop>
          <source src={image} type="video/mp4" />
          <source src={image} type="video/ogg" />
          <source src={image} type="video/mov" />
          <source src={image} type="video/avi" />
          <source src={image} type="video/wmv" />
          <source src={image} type="video/flv" />
          <source src={image} type="video/webm" />
          <source src={image} type="video/mkv" />
          <source src={image} type="video/avchd" />
        </video>
      ) : (
        <>
          <LazyLoadImage
            effect="blur"
            src={image}
            alt="art"
            onError={() => setIsVideo(true)}
            width={"100%"}
            heigh={"100%"}
          />
        </>
      )}
    </div>
  );

  const renderContent = (
    <div className="card_content">
      <div
        className="overlay"
        onClick={() => history.push(`/nft_details/${id}`)}
      ></div>
      <Text variant="primary" className="title">
        {name}
      </Text>
      <Text>
        By: #
        {`${creator?.slice(0, 4)}...${creator?.slice(creator?.length - 4)}`}
      </Text>

      <Countdown date={new Date(endTime * 1000)} renderer={renderer} />
    </div>
  );

  const renderCard = (
    <div className="card">
      {renderImage}
      {renderContent}
    </div>
  );

  return (
    <>
      {renderCard}
      <LiveAuctionModal
        {...props}
        symbol={symbol}
        handleBidMethod={handleBidMethod}
        isModal={isModal}
        setIsModal={setIsModal}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt
        variant="success"
        isModal={isSuccess}
        handleAbort={handleAbort}
        successContent="Congratulations, you have successfully bid on this NFT, you are the current highest bidder…. Good luck"
      />
      <Prompt variant="error" isModal={isError} errorMessage={errorMessage} />
    </>
  );
};

export default Card;
