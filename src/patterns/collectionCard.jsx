import React, { useContext, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Web3 from "web3";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios"
import fleekStorage from '@fleekhq/fleek-storage-js'

//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { CollectionModal } from "./modal";
import Prompt from "./prompt";

//IMPORTING MEDIA ASSETS

import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";
import NFTPortImage from "../assets/placeholders/nftport.gif"
import FleekImage from "../assets/placeholders/fleek.gif"
import IpfsImage from "../assets/placeholders/ipfs.gif"

//IMPORTING UTILITY PACKGAES

import { baseUrl, BIDIFY, getLogUrl, getSymbol, snowApi, URLS } from "../utils/config";
import { getDecimals, atomic, getListing, unatomic } from "../utils/Bidify";
import { useWeb3React } from "@web3-react/core";
import { ERC721, ERC1155 } from "../utils/config";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import { getBase64ImageBuffer } from "../utils/NFTFetcher";
import { UserContext } from "../store/contexts";


const CollectionCard = (props) => {
  const { name, description, image, platform, token, getDetails, isERC721, getFetchValues } = props;

  const { chainId, account, library } = useWeb3React();
  const videoRef = useRef(null);

  // const account = '0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158'

  const [processContent, setProcessContent] = useState("");
  const [transaction, setTransaction] = useState();

  const [isVideo, setIsVideo] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [symbol, setSymbol] = useState("")
  const [loadingImage, setLoadingImage] = useState(true)
  const [placeholder, setPlaceholder] = useState("")
  const history = useHistory()
  const { userDispatch } = useContext(UserContext);
  useEffect(() => {
    if (image.includes('storage.googleapis.com')) return setPlaceholder(NFTPortImage)
    if (image.includes('fleek.co')) return setPlaceholder(FleekImage)
    return setPlaceholder(IpfsImage)
  }, [image, setPlaceholder])
  const initialValues = {
    price: "0",
    endingPrice: "0",
    days: "",
    platform,
    token,
    // currency: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    currency: null,
  };

  useEffect(() => {
    if (account) {
      setSymbol(getSymbol(chainId))
    }
  }, [account, chainId])
  const validationSchema = Yup.object({
    price: Yup.number()
      .typeError("price must be a number")
      .min(0.000001, "price must be greater than 0")
      .required("This field is required"),
    endingPrice: Yup.number()
      .typeError("price must be a number")
      .required("This field is required"),
    days: Yup.number()
      .typeError("days must be a number")
      .min(1, "days must be greater than one day")
      .max(10, "days should be less than 10 days")
      .required("This field is required"),
  });
  const onSubmit = async (values, onSubmitProps) => {
    setIsModal(false);
    setIsLoading(true);
    setProcessContent(
      "Uploading image to the fleek storage"
    );
    const buffer = await getBase64ImageBuffer(image).catch(e => console.log('error in promise', e))
    let uploadedFile = {publicUrl: undefined}
    if (buffer !== undefined) {
      const files = await fleekStorage.listFiles({
        apiKey: process.env.REACT_APP_API_KEY,
        apiSecret: process.env.REACT_APP_API_SECRET,
        bucket: process.env.REACT_APP_BUCKET,
        getOptions: [
          'key',
          'hash',
          'publicUrl'
        ],
      })
      const key = files.length
      try {
        uploadedFile = await fleekStorage.upload({
          apiKey: process.env.REACT_APP_API_KEY,
          apiSecret: process.env.REACT_APP_API_SECRET,
          bucket: process.env.REACT_APP_BUCKET,
          key: key.toString(),
          data: buffer,
          httpUploadProgressCallback: (event) => {
            console.log(Math.round(event.loaded / event.total * 100) + '% done');
          }
        })
      } catch (e) {
        setIsLoading(false);
        return console.log("err while uploading image", e)
      }
    }
    // return console.log(uploadedFile)
    // return setTimeout(() => {
    //   setIsSuccess(true)
    // }, 10000)
    const { currency, platform, token, price, endingPrice, days } = values;
    // return console.log(atomic(price.toString(), 18).toString(), atomic(endingPrice.toString(), 18).toString(),)
    setProcessContent(
      "Please allow https://bidify.org permission within your wallet when prompted, there will be a small fee for this…"
    );
    try {
      await signList({ platform, token, isERC721 });
      setProcessContent(
        "Confirm the second transaction to allow your NFT to be listed, there will be another small network fee."
      );
      await list({ currency, platform, token, price, endingPrice, days, image: uploadedFile.publicUrl });
      const response = await axios.get(`${baseUrl}/collection`, { params: { chainId, owner: account } })
      const results = response.data
      userDispatch({
        type: "MY_COLLECTIONS",
        payload: { results, isCollectionFetched: true },
      });
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
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: 'get',
        url: 'https://gasstation-mainnet.matic.network/v2'
      })
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + '',
        'gwei'
      )
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + '',
        'gwei'
      )
    } catch {
      // ignore
    }
    // const web3 = new Web3(window.ethereum);
    const erc721 = new ethers.Contract(platform, ERC721.abi, library.getSigner())
    const erc1155 = new ethers.Contract(platform, ERC1155.abi, library.getSigner())
    let tx
    if (isERC721)
      tx = chainId === 137 ?
        await erc721
          .approve(BIDIFY.address[chainId], token, { maxFeePerGas, maxPriorityFeePerGas }) :
        await erc721
          .approve(BIDIFY.address[chainId], token)
    else
      tx = chainId === 137 ?
        await erc1155
          .setApprovalForAll(BIDIFY.address[chainId], true, { maxFeePerGas, maxPriorityFeePerGas }) :
        await erc1155
          .setApprovalForAll(BIDIFY.address[chainId], true)
    await tx.wait()
  }
  const getLogs = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic0 =
      "0x5424fbee1c8f403254bd729bf71af07aa944120992dfa4f67cd0e7846ef7b8de";
    let logs = [];
    try {
      if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
        const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}address=${BIDIFY.address[chainId]}&topic0=${topic0}&apikey=${snowApi[chainId]}`)
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
    image
  }) {
    let decimals = await getDecimals(currency);
    if (!currency) {
      currency = "0x0000000000000000000000000000000000000000";
    }
    const Bidify = new ethers.Contract(
      BIDIFY.address[chainId],
      BIDIFY.abi,
      library.getSigner()
    );
    // return token;
    const tokenNum = isERC721 ? token : new Web3(window.ethereum).utils.hexToNumberString(token);
    // return console.log("before list", atomic(price.toString(), decimals).toString())
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: 'get',
        url: 'https://gasstation-mainnet.matic.network/v2'
      })
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + '',
        'gwei'
      )
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + '',
        'gwei'
      )
    } catch {
      // ignore
    }
    try {
      const totalCount = await getLogs()
      const tx = chainId === 137 ? await Bidify
        .list(
          currency,
          platform,
          tokenNum.toString(),
          atomic(price.toString(), decimals).toString(),
          atomic(endingPrice.toString(), decimals).toString(),
          Number(days),
          isERC721,
          "0x0000000000000000000000000000000000000000",
          { maxFeePerGas, maxPriorityFeePerGas }
        ) :
        await Bidify
          .list(
            currency,
            platform,
            tokenNum.toString(),
            atomic(price.toString(), decimals).toString(),
            atomic(endingPrice.toString(), decimals).toString(),
            Number(days),
            isERC721,
            "0x0000000000000000000000000000000000000000"
          )
      const ret = await tx.wait()
      // console.log("transaction", ret)
      setTransaction(ret)
      if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100)
        while (await getLogs() === totalCount) {
          console.log("while loop")
        }
      // console.log("listed results", tx, det)
      // const listCnt = await getLogs()
      // console.log("total Count", totalCount)
      const newId = totalCount
      // await delay()
      const listingDetail = await getDetailFromId(newId)
      await axios.post(`${baseUrl}/auctions`, { ...listingDetail, image_cache: image })
    } catch (error) {
      return console.log("list error", error)
    }
  }

  const getListingDetail = async (id) => {
    const bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
    let raw = await bidify.getListing(id.toString())
    while (raw.creator === "0x0000000000000000000000000000000000000000") {
      raw = await bidify.getListing(id.toString())
    }
    // console.log("raw", raw)
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
    const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}topic0=0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914&topic0_1_opr=and&topic1=${chainId === 9001 || chainId === 100 ? topic1.toLowerCase() : topic1}&apikey=${snowApi[chainId]}`)
    const logs = ret.data.result
    // console.log("bid logs", logs)
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
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
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
    <div className="card_image cursor" onClick={() => history.push(`/nft_details/${platform}/${token}`)}>
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
        <>
          {loadingImage && <img className='placeholder' src={placeholder} alt="" />}
          <LazyLoadImage
            effect="blur"
            src={image}
            alt="art"
            placeholder={<img src={NFTPortImage} alt="" />}
            onError={() => setIsVideo(true)}
            afterLoad={() => setLoadingImage(false)}
            width={"100%"}
            heigh={"100%"}
          />
        </>
      )}
    </div>
  );

  const renderContent = (
    <div className="card_content cursor">
      <div className="overlay" onClick={() => history.push(`/nft_details/${platform}/${token}`)}></div>
      <Text variant="primary" className="title">
        {name}
      </Text>
      <div className="description_block">
        <Text className="description">{description}</Text>
      </div>
      <Button variant="secondary" onClick={(e) => setIsModal(true)}>
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
        transaction={transaction}
        chainId={chainId}
      />
      <Prompt variant="error" isModal={isError} />
    </>
  );
};

export default CollectionCard;
