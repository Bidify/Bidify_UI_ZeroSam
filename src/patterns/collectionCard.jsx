import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Web3 from "web3";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios"
//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { CollectionModal } from "./modal";
import Prompt from "./prompt";

//IMPORTING MEDIA ASSETS

import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";

//IMPORTING UTILITY PACKGAES

import { baseUrl, BIDIFY, getLogUrl, snowApi, URLS } from "../utils/config";
import { getDecimals, atomic, getListing, unatomic } from "../utils/Bidify";
import { useWeb3React } from "@web3-react/core";
import { ERC721, ERC1155 } from "../utils/config";
import { ethers } from "ethers";

const CollectionCard = (props) => {
  const { name, description, image, platform, token, getDetails, isERC721, getFetchValues } = props;

  const { chainId, account, library } = useWeb3React();
  const videoRef = useRef(null);

  // const account = '0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158'

  const [processContent, setProcessContent] = useState("");

  const [isVideo, setIsVideo] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [symbol, setSymbol] = useState("")
  const initialValues = {
    price: "",
    endingPrice: "",
    days: "",
    platform,
    token,
    // currency: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    currency: null,
  };

  useEffect(() => {
    if (account) {
      switch (chainId) {
        case 43113: case 43114:
          setSymbol("AVAX");
          break;
        case 137: case 80001:
          setSymbol("MATIC");
          break;
        case 1987:
          setSymbol("EGEM");
          break;
        default:
          setSymbol("ETH");
          break;
      }
    }
  }, [account, chainId])
  const validationSchema = Yup.object({
    price: Yup.number()
      .typeError("price must be a number")
      .min(0, "price must be greater than 20")
      .required("This field is required"),
    endingPrice: Yup.number()
      .typeError("price must be a number")
      .min(0, "price must be greater than 20")
      .required("This field is required"),
    days: Yup.number()
      .typeError("days must be a number")
      .min(1, "days must be greater than one day")
      .max(10, "days should be less than 10 days")
      .required("This field is required"),
  });

  const onSubmit = async (values, onSubmitProps) => {
    return setIsSuccess(true)
    const { currency, platform, token, price, endingPrice, days } = values;
    setIsModal(false);
    setIsLoading(true);
    setProcessContent(
      "Please allow https://bidify.org permission within your wallet when prompted, there will be a small fee for this…"
    );
    try {
      await signList({ platform, token, isERC721 });
      setProcessContent(
        "Confirm the second transaction to allow your NFT to be listed, there will be another small network fee."
      );
      await list({ currency, platform, token, price, endingPrice, days });
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    } finally {
      onSubmitProps.setSubmitting(false);
      onSubmitProps.resetForm();
    }
  };

  async function signList({
    platform,
    token,
    isERC721,
  }) {

    const web3 = new Web3(window.ethereum);
    if (isERC721)
      await new web3.eth.Contract(ERC721.abi, platform).methods
        .approve(BIDIFY.address[chainId], token)
        .send({ from: account });
    else
      await new web3.eth.Contract(ERC1155.abi, platform).methods
        .setApprovalForAll(BIDIFY.address[chainId], true)
        .send({ from: account });
  }
  const getLogs = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic0 =
      "0x5424fbee1c8f403254bd729bf71af07aa944120992dfa4f67cd0e7846ef7b8de";
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

    return logs.length;
  };
  async function list({
    currency,
    platform,
    token,
    price,
    endingPrice,
    days,
    allowMarketplace = false,
  }) {
    let decimals = await getDecimals(currency);
    if (!currency) {
      currency = "0x0000000000000000000000000000000000000000";
    }
    const Bidify =  new ethers.Contract(
      BIDIFY.address[chainId],
      BIDIFY.abi,
      library.getSigner()
    );
    // return token;
    const tokenNum = isERC721 ? token : new Web3(window.ethereum).utils.hexToNumberString(token);
    // return console.log("before list", atomic(price.toString(), decimals).toString())
    try {
      const totalCount = await getLogs()
      const tx = await Bidify
        .list(
          currency,
          platform,
          tokenNum.toString(),
          atomic(price.toString(), decimals).toString(),
          atomic(endingPrice.toString(), decimals).toString(),
          Number(days),
          "0x0000000000000000000000000000000000000000",
          allowMarketplace,
          isERC721
        )
      await tx.wait()
      if(chainId === 137 || chainId === 43114)
        while(await getLogs() === totalCount) {
          console.log("while loop")
        }
      // console.log("listed results", tx, det)
      // const listCnt = await getLogs()
      console.log("total Count")
      const newId = totalCount
      // await delay()
      const listingDetail = await getDetailFromId(newId)
      console.log("adding to database", listingDetail)
      await axios.post(`${baseUrl}/auctions`, listingDetail)
    } catch (error) {
      return console.log("list error", error)
    }
  }
  // const delay = async() => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, [3000])
  //   })
  // }
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
    let endingPrice = raw.endingPrice;
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
      endingPrice: unatomic(endingPrice.toString(), decimals),

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
    if(chainId === 43114 || chainId === 137) {
      detail = await getListingDetail(id)
    }
    else detail = await getListing(id)
    const fetchedValue = await getFetchValues(detail)
    return { ...fetchedValue, ...detail, network: chainId }

  }


  const renderCreateForm = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="create_form">
          <Text>Initial Bid Amount</Text>
          <div className="form_input">
            <Field type="number" name="price" id="price" />
            <Text style={{ color: "#F79420" }}>{symbol}</Text>
          </div>
          <ErrorMessage
            name="price"
            component="p"
            className="error_input_msg"
          />
          <Text>Buy It Now Price</Text>
          <div className="form_input">
            <Field type="number" name="endingPrice" id="endingPrice" />
            <Text style={{ color: "#F79420" }}>{symbol}</Text>
          </div>
          <ErrorMessage
            name="endingPrice"
            component="p"
            className="error_input_msg"
          />
          <Text>Bidding Days</Text>
          <div className="form_input">
            <Field type="number" name="days" id="days" />
          </div>
          <ErrorMessage
            name="days"
            component="div"
            className="error_input_msg"
          />
          <Button variant="primary" type="submit">
            Create Auction
          </Button>
        </div>
      </Form>
    </Formik>
  );

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };

  const renderImage = (
    <div className="card_image">
      {isVideo ? (
        <>
          <video ref={videoRef} loop>
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
          {
            <img
              src={isPlay ? pauseImg : playImg}
              alt="button"
              className="video_nav_btn"
              onClick={!isPlay ? () => handlePlay() : () => handlePause()}
            />
          }
        </>
      ) : (
        <LazyLoadImage
          effect="blur"
          src={image}
          alt="art"
          onError={() => setIsVideo(true)}
          width={"100%"}
          heigh={"100%"}
        />
      )}
    </div>
  );

  const renderContent = (
    <div className="card_content">
      <Text variant="primary" className="title">
        {name}
      </Text>
      <div className="description_block">
        <Text className="description">{description}</Text>
      </div>
      <Button variant="secondary" onClick={() => setIsModal(true)}>
        Create Auction
      </Button>
    </div>
  );

  const renderCard = (
    <div className="card">
      {renderImage}
      {renderContent}
    </div>
  );

  const handleAbort = () => {
    setIsSuccess(false)
    getDetails()
  }

  return (
    <>
      {renderCard}
      <CollectionModal
        {...props}
        renderCreateForm={renderCreateForm}
        isModal={isModal}
        setIsModal={setIsModal}
        setIsLoading={setIsLoading}
        setIsError={setIsError}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt
        variant="success"
        isModal={isSuccess}
        handleAbort={handleAbort}
        successContent={
          "Your NFT has now been listed and will be available to purchase on Bidify and all applicable Bidify powered sites and platforms."
        }
        name={name}
      />
      <Prompt variant="error" isModal={isError} />
    </>
  );
};

export default CollectionCard;
