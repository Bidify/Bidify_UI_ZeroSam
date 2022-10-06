import React, { useEffect, useState, Fragment, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { atomic, getDecimals, getListing, unatomic } from "../utils/Bidify";
import { FetchWrapper } from "use-nft";
import Web3 from "web3";
import Countdown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { ethers, Contract } from "ethers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//STYLESHEET

import "../styles/pages/detailspage.scss";

//IMPORTING PATTERNS

import Footer from "../patterns/footer";
import ScreenTemplate from "../patterns/screenTemplate";
import { Button, Text } from "../components";
import Prompt from "../patterns/prompt";

//IMPORTING MEDIA ASSETS

import lock from "../assets/icons/lock.svg";
import NFTPortImage from "../assets/placeholders/nftport.gif"
import FleekImage from "../assets/placeholders/fleek.gif"
import IpfsImage from "../assets/placeholders/ipfs.gif"

//IMPORTING UTILITY PACKGAES

// import { signBid, bid } from "../utils/Bidify";

//IMPORTING MEDIA ASSETS

import loader from "../assets/icons/loader.svg";
import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";

//IMPORTING UTILITY PACKAGES

import { baseUrl, BIDIFY, BIT, ERC1155, ERC721, EXPLORER, getLogUrl, getSymbol, snowApi, URLS } from "../utils/config";
import axios from "axios";
import PromptFinish from "../patterns/promptFinish";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getBase64ImageBuffer } from "../utils/NFTFetcher";
import fleekStorage from '@fleekhq/fleek-storage-js'
import { CollectionModal } from "../patterns/modal";
import { UserContext } from "../store/contexts";

const DetailsPage = () => {
  //INITIALIZING HOOKS

  const { id, platform } = useParams();
  const videoRef = useRef(null);

  const [isVideo, setIsVideo] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModal, setIsModal] = useState(false);
  // const [paramId, setParamId] = useState();
  const { chainId, account, library } = useWeb3React();
  const [isPlay, setIsPlay] = useState(false);
  const [yourBid, setYourBid] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true)
  const [placeholder, setPlaceholder] = useState("")
  const [transfers, setTransfers] = useState([])
  const [symbol, setSymbol] = useState("")
  const [processContent, setProcessContent] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [latestDetail, setLatestDetail] = useState()
  const [transaction, setTransaction] = useState()
  const { userDispatch } = useContext(UserContext);

  useEffect(() => {
    if (data?.length === 0) return;
    setLatestDetail(data[0])
    getTransferHistory()
    const image = data[0].image_cache ? data[0].image_cache : data[0].image
    if (image.includes('storage.googleapis.com')) return setPlaceholder(NFTPortImage)
    if (image.includes('fleek.co')) return setPlaceholder(FleekImage)
    return setPlaceholder(IpfsImage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setPlaceholder])
  // const isUser = account?.toLocaleLowerCase() === creator?.toLocaleLowerCase();
  //HANDLING METHODS
  const handleAbort = () => {
    setIsSuccess(false)
    setIsFinished(false)
    getLists()
  }
  useEffect(() => {
    if (chainId) getData()
    if (account) {
      setSymbol(getSymbol(chainId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);
  const getData = async () => {
    if (platform === 'auction') {
      const response = await axios.get(`${baseUrl}/auctions/${id}?network=${chainId}`)
      setData(response.data ? [response.data] : [])
    } else {
      const response = await axios.get(`${baseUrl}/collection/${platform}/${id}`, { params: { chainId, owner: account } })
      setData(response.data ? [response.data] : [])
    }
  }
  // eslint-disable-next-line no-unused-vars
  const getLists = async (id) => {
    //setData();
    //const Bidify = new web3.eth.Contract(BIDIFY.abi, BIDIFY.address);
    //const totalAuction = await Bidify.methods.totalListings().call();

    const totalAuction = await getLogs();
    let Lists = [];
    for (let i = 0; i < totalAuction; i++) {
      const result = await getListing(i.toString());
      Lists[i] = result;
    }
    getDetails(Lists, id);
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
      case 4:
        provider = new ethers.providers.InfuraProvider(
          "rinkeby",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 1987: case 43114: case 137: case 56: case 9001: case 1285: case 61: case 100:
        provider = new ethers.providers.JsonRpcProvider(URLS[chainId])
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
      if (url.includes('ipfs://')) return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
      if (url.includes('https://ipfs.io/ipfs/')) return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      if (check === "ipfs") {
        const manipulated = url.substr(16, 16 + 45);
        return "https://dweb.link/" + manipulated;
      } else {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      }
    }
    const fetchWrapper = new FetchWrapper(fetcher, {
      jsonProxy: (url) => {
        // return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        return url
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

  const getDetails = async (lists, id) => {
    const unsolvedPromises = lists.map((val) => getFetchValues(val));
    const results = await Promise.all(unsolvedPromises);
    const filteredData = results.filter((val) => val.id === String(id));
    setData(filteredData);
  };

  const handleFinishAuction = async () => {
    // return setIsFinished(true)
    setIsLoading(true);
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
      const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
      const tx = chainId === 137 ? await Bidify.finish(id.toString(), { maxFeePerGas, maxPriorityFeePerGas }) : await Bidify.finish(id.toString())
      const ret = await tx.wait()
      setTransaction(ret)
      // await new new Web3(window.ethereum).eth.Contract(
      //   BIDIFY.abi,
      //   BIDIFY.address[chainId]
      // ).methods
      //   .finish(id.toString())
      //   .send({ from: account });
      let updateData = await getDetailFromId(id);
      while (!updateData.paidOut) {
        updateData = await getDetailFromId(id)
      }
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      await getData();
      await getTransferHistory()
      setIsLoading(false);
      setIsFinished(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const getDetailFromId = async (id) => {
    let detail
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
      detail = await getListingDetail(id)
    }
    else detail = await getListing(id)
    const fetchedValue = await getFetchValues(detail)
    return { ...fetchedValue, network: chainId }

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
    let endingPrice = raw.endingPrice;
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
    const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}topic0=0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914&topic0_1_opr=and&topic1=${chainId === 9001 || chainId === 100 ? topic1.toLowerCase() : topic1}&apikey=${snowApi[chainId]}`)
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
  const bid = async (id, amount) => {
    let currency
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) currency = (await getListingDetail(id)).currency;
    else currency = (await getListing(id.toString())).currency
    let decimals = await getDecimals(currency)
    const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
    const from = account
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
    if (currency) {
      const tx = chainId === 137 ? await Bidify
        .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), { maxFeePerGas, maxPriorityFeePerGas }) :
        await Bidify
          .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString())
      const ret = await tx.wait()
      setTransaction(ret)
    } else {
      const tx = chainId === 137 ? await Bidify
        .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), {
          from: from,
          value: atomic(amount, decimals).toString(),
          maxFeePerGas,
          maxPriorityFeePerGas
        }) :
        await Bidify
          .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), {
            from: from,
            value: atomic(amount, decimals).toString()
          })
      const ret = await tx.wait()
      setTransaction(ret)
    }
  }
  const signBid = async (id, amount) => {
    // return;
    const from = account;
    const chain_id = chainId;
    let currency
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) currency = (await getListingDetail(id)).currency;
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
      if (Number(amount) >= Number(allowance)) {
        const tx = await erc20
          .approve(Bidify._address, atomic(balance, decimals))
        await tx.wait()
      }
    }

    if (Number(balance) < Number(amount)) {
      throw new Error("low_balance");
    }
  }
  const handleBidMethod = async (id, amount) => {
    setIsLoading(true);
    setProcessContent(
      "Please allow https://Bidify.org permission within your wallet when prompted there will be a small fee for this"
    );
    try {
      await signBid(id, amount);
      setProcessContent(
        "Confirm the second transaction of your bid amount, there will be a small network fee for this."
      );
      await bid(id, amount);
      while (account !== (await getDetailFromId(id)).highBidder) {
        console.log("in while loop")
      }
      const updateData = await getDetailFromId(id);
      setLatestDetail(updateData)
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      await getData()
      setIsLoading(false);

      if (amount >= data[0].endingPrice && Number(data[0].endingPrice) !== 0) setIsFinished(true)
      else setIsSuccess(true);
      // setTimeout(() => {
      //   setIsSuccess(false);
      //   window.location.reload();
      // }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };
  const getTransferHistory = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic = "0x" + parseInt(data[0].token).toString(16).padStart(64, "0")
    let logs = []
    // let logs_1155 = []
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
      const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}address=${data[0].platform}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_3_opr=and&topic3=${chainId === 9001 || chainId === 100 ? topic.toLowerCase() : topic}&apikey=${snowApi[chainId]}`).catch(e => console.log("getNft error"))
      logs = ret.data.result
    }

    // Get all transfers to us
    else logs = await web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: "latest",
      address: data[0].platform,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        null,
        null,
        topic,
      ],
    }).catch(e => {
      console.log("error on getpastlogs", e.message)
    });
    const pTransferList = logs.map(async (log) => {
      let currency = null
      let value = null
      const to = getAddress(log.topics[2])
      const to_64bit = "0x" + to.split("0x")[1].padStart(64, "0")
      const tHash = log.transactionHash
      const tx_receipt = await web3.eth.getTransactionReceipt(tHash)
      const block = await web3.eth.getBlock(tx_receipt.blockNumber)
      const tx_logs = tx_receipt.logs
        .filter(item => item.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && item.topics.length === 3 && item.topics[1].toLowerCase() === to_64bit.toLowerCase())
      if (tx_logs.length === 0) {
        const tx = await web3.eth.getTransaction(tHash);
        value = ethers.utils.formatEther(tx.value)
      }
      else {
        const contract_address = tx_logs[0].address
        currency = await new ethers.Contract(contract_address, BIT.abi, library.getSigner()).symbol()
        value = ethers.utils.formatEther(tx_logs[0].data)
        // console.log(currency, ethers.utils.formatEther(tx_logs[0].data))
        // const decodedParameters = web3.eth.abi.decodeParameters([{type: 'number', name: 'value'}], tx_logs[0].data)
        // console.log(decodedParameters)
      }
      return {
        ...log,
        currency,
        value,
        created: block.timestamp
      }
    })
    const transferList = await Promise.all(pTransferList).catch(e => console.log(e))
    setTransfers(transferList)
  }
  const getAddress = (str) => {
    return "0x" + str.substr(str.length - 40, 40);
  }
  const shortAddress = (address) => {
    return address.substr(0, 4) + "..." + address.substr(address.length - 4, 4)
  }
  const getDateTimeString = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toDateString()
  }
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          {data?.map((val, index) => {
            return (
              <Fragment key={index}>
                <div className="bid_details">
                  <div>
                    <Text
                      variant="primary"
                      style={{ color: "#F79420", fontWeight: 500 }}
                    >
                      {val.currentBid ? val.currentBid : 0} {symbol}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Reserved price</Text>
                  </div>
                </div>
                <div className="content_footer">
                  <Button
                    variant="primary"
                    onClick={() => handleFinishAuction(val.id)}
                    disabled={val.paidOut}
                  >
                    {val.paidOut ? "Already Finished" : "Finish Auction"}
                  </Button>

                  {/* <Button variant="secondary">Pay gas fees</Button> */}
                  <Text style={{ fontSize: 12 }}>
                    1% seller fee to be added
                  </Text>
                </div>
              </Fragment>
            );
          })}
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          {data?.map((val, index) => {
            return (
              <Fragment key={index}>
                <div className="bid_details">
                  <div>
                    <Text
                      variant="primary"
                      style={{ color: "#F79420", fontWeight: 500 }}
                    >
                      {val.currentBid ? val.currentBid : 0} {symbol}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Current bid</Text>
                  </div>
                  <div>
                    <Text
                      variant="primary"
                      style={{ color: "#FB5050", fontWeight: 500 }}
                    >
                      {days} : {hours} : {minutes} : {seconds}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Bidding Ends On {new Date(val.endTime * 1000).toLocaleString()}</Text>
                  </div>
                </div>
                <div className="content_footer">
                  {account.toLocaleLowerCase() !==
                    val.creator.toLocaleLowerCase() && (
                      <>
                        <Text
                          variant="primary"
                          style={{
                            fontSize: 14,
                            marginBottom: 10,
                            textAlign: "start",
                          }}
                        >
                          Bid amount
                        </Text>
                        <div className="form_input">
                          {/* <Text variant="primary">{val.nextBid}</Text> */}
                          <input className="bid-input" type="number" defaultValue={val.nextBid} onChange={(e) => { setYourBid(e.target.value) }} />
                          <Text style={{ color: "#F79420" }}>{val.symbol}</Text>
                        </div>
                      </>
                    )}
                  {account.toLocaleLowerCase() ===
                    val.creator.toLocaleLowerCase() ? (
                    <Button
                      variant="secondary"
                      style={{ pointerEvents: "none" }}
                    >
                      <img src={lock} alt="lock" width={14} />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      style={{ pointerEvents: account?.toLocaleLowerCase() === val.highBidder?.toLocaleLowerCase() && "none" }}
                      onClick={() => handleBidMethod(val.id, yourBid ? yourBid : val.nextBid)}
                    >
                      {account?.toLocaleLowerCase() !== val.highBidder?.toLocaleLowerCase() ? "Place Your Bid" : "You are the highest bidder"}
                    </Button>
                  )}

                  {/* <Button variant="secondary">Pay gas fees</Button> */}
                  <Text style={{ fontSize: 12 }}>
                    1% seller fee to be added
                  </Text>
                </div>
              </Fragment>
            );
          })}
        </>
      );
    }
  };

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };
  const renderImage = (
    <>
      {data?.map(({ image, image_cache }, index) => {
        const imageToDisplay = image_cache ? image_cache : image
        return (
          <div className="image" key={index}>
            {isVideo ? (
              <>
                <video controls loop>
                  <source src={imageToDisplay} type="video/mp4" />
                  <source src={imageToDisplay} type="video/ogg" />
                  <source src={imageToDisplay} type="video/mov" />
                  <source src={imageToDisplay} type="video/avi" />
                  <source src={imageToDisplay} type="video/wmv" />
                  <source src={imageToDisplay} type="video/flv" />
                  <source src={imageToDisplay} type="video/webm" />
                  <source src={imageToDisplay} type="video/mkv" />
                  <source src={imageToDisplay} type="video/avchd" />
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
                {loadingImage && <img src={placeholder} alt="" />}
                <LazyLoadImage
                  effect="blur"
                  src={imageToDisplay}
                  alt="art"
                  placeholder={
                    <div></div>
                  }
                  onError={() => setIsVideo(true)}
                  afterLoad={() => setLoadingImage(false)}
                />
              </>
            )}
          </div>
        );
      })}
    </>
  );

  const renderNFTDetails = (
    <>
      {data?.map((val, index) => {
        return (
          <div className="nft_details" key={index}>
            <div className="content">
              <Text className="title" variant="primary">
                {val.name}
              </Text>
              <Text
                className="description"
                style={{ fontSize: 12, marginTop: 10 }}
              >
                {val.description}
              </Text>
              {/* <div>
                <img src={like} alt="like" />
                <img src={share} alt="share" />
                <img src={dot} alt="dot" />
              </div> */}
            </div>

            {platform === 'auction' ?
              <Countdown
                date={new Date(val.endTime * 1000)}
                renderer={renderer}
              /> :
              <Button
                variant="primary"
                onClick={() => setIsModal(true)}
                disabled={val.paidOut}
              >
                Create Auction
              </Button>}
          </div>
        );
      })}
    </>
  );
  const renderScreen = (
    <div className="details_page">
      <div className="block">
        {renderImage}
        {renderNFTDetails}
      </div>
      <div className="nft_activity">
        <Text variant="primary" style={{ marginBottom: 5 }}>
          Ownership activity
        </Text>
        <Text>Know the history of this rare NFT artifact</Text>
        {data?.map((val, index) => {
          return (
            <div className="history_details" key={index}>
              {transfers.length > 0 ? (
                transfers.map((detail, index) => {
                  return (
                    <div className="flex_gap" key={index}>
                      <Text
                        variant="primary"
                        style={{ fontSize: 14 }}
                      >
                        From:&nbsp;<a target="_blank" rel="noreferrer" href={`${EXPLORER[chainId]}/address/${getAddress(detail.topics[1])}`} style={{ color: "#F79420", minWidth: 100 }}>{detail.topics[1] === "0x0000000000000000000000000000000000000000000000000000000000000000" ? "NullAddress" : (getAddress(detail.topics[1]).toLowerCase() === BIDIFY.address[chainId].toLowerCase() ? "Bidify" : shortAddress(getAddress(detail.topics[1])))}</a>
                      </Text>
                      <Text
                        variant="primary"
                        style={{ fontSize: 14 }}
                      >
                        To:&nbsp;<a target="_blank" rel="noreferrer" href={`${EXPLORER[chainId]}/address/${getAddress(detail.topics[2])}`} style={{ color: "#F79420", minWidth: 100 }}>{detail.topics[2] === "0x0000000000000000000000000000000000000000000000000000000000000000" ? "NullAddress" : (getAddress(detail.topics[2]).toLowerCase() === BIDIFY.address[chainId].toLowerCase() ? "Bidify" : shortAddress(getAddress(detail.topics[2])))}</a>
                      </Text>
                      <Text
                        variant="primary"
                        style={{ fontSize: 14, flexGrow: 1 }}
                      >
                        {Number(detail.value) > 0 ? "Price:" : ""}&nbsp;<span style={{ color: "#F79420", minWidth: 100 }}>{Number(detail.value) ? `${detail.value} ${detail.currency ? detail.currency : getSymbol(chainId)}` : ''}</span>
                      </Text>
                      <Text variant="primary">
                        {getDateTimeString(detail.created)}
                      </Text>
                      <a href={`${EXPLORER[chainId]}/tx/${detail.transactionHash}`} target="_blank" rel="noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                          width="30" height="30"
                          viewBox="0 0 172 172"><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#f79420"><path d="M148.95469,17.14401c-0.21364,0.00675 -0.42673,0.02544 -0.63828,0.05599h-33.64974c-2.06765,-0.02924 -3.99087,1.05709 -5.03322,2.843c-1.04236,1.78592 -1.04236,3.99474 0,5.78066c1.04236,1.78592 2.96558,2.87225 5.03322,2.843h20.55938l-59.01302,59.01302c-1.49778,1.43802 -2.10113,3.5734 -1.57735,5.5826c0.52378,2.0092 2.09284,3.57826 4.10204,4.10204c2.0092,0.52378 4.14458,-0.07957 5.5826,-1.57735l59.01302,-59.01302v20.55938c-0.02924,2.06765 1.05709,3.99087 2.843,5.03322c1.78592,1.04236 3.99474,1.04236 5.78066,0c1.78592,-1.04236 2.87225,-2.96558 2.843,-5.03322v-33.67214c0.23111,-1.67076 -0.28511,-3.35853 -1.41129,-4.61415c-1.12617,-1.25562 -2.74806,-1.95172 -4.43402,-1.90304zM34.4,40.13333c-6.26689,0 -11.46667,5.19977 -11.46667,11.46667v86c0,6.26689 5.19977,11.46667 11.46667,11.46667h86c6.26689,0 11.46667,-5.19977 11.46667,-11.46667v-57.33333v-14.78125l-11.46667,11.46667v14.78125v45.86667h-86v-86h45.86667h11.46667h3.31458l11.46667,-11.46667h-14.78125h-11.46667z"></path></g></g></svg>
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="flex">
                  <Text style={{ fontWeight: 500 }}>
                    No recent activity here
                  </Text>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  const initialValues = {
    price: "0",
    endingPrice: "0",
    days: "",
    platform,
    token: id,
    // currency: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    currency: null,
  };
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
    const buffer = await getBase64ImageBuffer(data[0].image).catch(e => console.log('error in promise', e))
    let uploadedFile
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
    const { currency, platform, token, price, endingPrice, days } = values;
    setProcessContent(
      "Please allow https://bidify.org permission within your wallet when prompted, there will be a small fee for this…"
    );
    try {
      await signList({ platform, token, isERC721: data[0].isERC721 });
      setProcessContent(
        "Confirm the second transaction to allow your NFT to be listed, there will be another small network fee."
      );
      await list({ currency, platform, token, price, endingPrice, days, image: uploadedFile.publicUrl });
      const response = await axios.get(`${baseUrl}/collection`, { params: { chainId, owner: account } })
      const results = response.data
      console.log(results)
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
    const tokenNum = data[0].isERC721 ? token : new Web3(window.ethereum).utils.hexToNumberString(token);
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
          data[0].isERC721,
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
            data[0].isERC721,
            "0x0000000000000000000000000000000000000000"
          )
      const ret = await tx.wait()
      // console.log("transaction", ret)
      setTransaction(ret)
      if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100)
        while (await getLogs() === totalCount) {
          console.log("while loop")
        }
      const newId = totalCount
      const listingDetail = await getDetailFromId(newId)
      console.log("adding to database", listingDetail)
      await axios.post(`${baseUrl}/auctions`, { ...listingDetail, image_cache: image })
    } catch (error) {
      return console.log("list error", error)
    }
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
  return (
    <>
      <ScreenTemplate>
        {data === undefined ? (
          <div className="grid_center">
            <img src={loader} alt="loader" width={24} />
          </div>
        ) : data?.length === 0 ? (
          <div className="grid_center">
            <Text>
              There is no NFT with token id{" "}
              <b style={{ fontWeight: 600, color: "#343434" }}>{id}</b>
            </Text>
          </div>
        ) : (
          renderScreen
        )}
        <Footer />
      </ScreenTemplate>
      <CollectionModal
        image={data.length > 0 ? data[0].image : ''}
        name={data.length > 0 ? data[0].name : ''}
        owner={data.length > 0 ? data[0].owner : ''}
        renderCreateForm={renderCreateForm}
        isModal={isModal}
        setIsModal={setIsModal}
        setIsLoading={setIsLoading}
        setIsError={setIsError}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt variant="success" isModal={isSuccess} handleAbort={handleAbort} successContent="Congratulations, you have successfully bid on this NFT, you are the current highest bidder…. Good luck" />
      <PromptFinish
        variant="success"
        isModal={isFinished}
        handleAbort={handleAbort}
        highBidder={latestDetail?.highBidder}
        seller={latestDetail?.creator}
        chainId={chainId}
        name={latestDetail?.name}
        transaction={transaction}
      />
      <Prompt variant="error" isModal={isError} />
    </>
  );
};

export default DetailsPage;
