import React, { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Web3 from "web3";

//IMPORTING COMPONENTS

import { Text } from "../components";

//IMPORTING STYLESHEET

import "../styles/patterns/profile.scss";

//IMPORTING MEDIA ASSETS

import metamask from "../assets/logo/metamask.svg";
import notification from "../assets/icons/notification.svg";
import copy from "../assets/icons/copy.svg";
import refresh from "../assets/icons/youtube.svg";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";
import { useWeb3React } from "@web3-react/core";
import { EXPLORER, getSymbol, NetworkData, supportedChainIds, URLS } from "../utils/config";
import { useEffect } from "react";
// import { getSymbol } from "../utils/getCurrencySymbol";
import { injected } from "../utils/connector";

const upcomingFeatures = [
  "Bidify Tutorials",
  "Bidify Token",
  "Bidify User Airdrop",
  "Discord/Telegram/Facebook Applications",
  "Bidify DAO",
  "Mobile Application",
];

const Profile = () => {
  //INITIALIZING HOOKS
  // const [currency, setCurrency] = useState(null);
  const { userState, userDispatch } = useContext(UserContext);
  const { account, active, activate, chainId } = useWeb3React();

  const [isCopied, setIsCopied] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [toggleSwitchNetwork, setToggleSwitchNetwork] = useState(false);
  const [balance, setBalance] = useState("");
  const [symbol, setSymbol] = useState("");
  const [networkName, setNetworkName] = useState();

  useEffect(() => {
    const getData = async () => {
      if (account) {
        const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
        let _balance = await web3.eth.getBalance(account); //Will give value in.
        _balance = web3.utils.fromWei(_balance);
        setBalance(_balance)
        setSymbol(getSymbol(chainId))
        return
      }
    }
    getData()
  }, [account, chainId]);

  const switchNetwork = async (_chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(_chainId) }],
      });
      setToggleSwitchNetwork(false);
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      console.log("error", error)
      if (error.code === 4902) {
        try {
          console.log(Web3.utils.toHex(_chainId), URLS[_chainId])
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              { 
                chainId: Web3.utils.toHex(_chainId), 
                rpcUrls: [URLS[_chainId]],
                chainName: NetworkData[_chainId].name,
                nativeCurrency: {
                  name: NetworkData[_chainId].name,
                  symbol: NetworkData[_chainId].symbol,
                  decimals: 18
                },
                blockExplorerUrls: [EXPLORER[_chainId]]
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  const handleSwitchNetwork = async (_chainId) => {
    if(!supportedChainIds.includes(Number(_chainId))) return;
    activate(injected)
    await switchNetwork(Number(_chainId))
    setToggleSwitchNetwork(false);
  };

  useEffect(() => {
    if (!account) {
      setBalance("")
      setSymbol("")
      setNetworkName("")
    }
    try {
      if (active) {
        setNetworkName(NetworkData[chainId].name)
      }
    } catch (err) {
      window.alert("Switch to Rinkeby Testnet");
    }
  }, [active, account, chainId]);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const renderSwitchNetwork = (
    <div className="switchnetwork_modal">
      {Object.values(NetworkData).sort((a, b) => Number(b.id) - Number(a.id)).map((val, index) => {
        return (
          <div key={index} onClick={() => handleSwitchNetwork(val.id)}>
            <mark style={{ background: val.color }}></mark>
            <code>{val.name}&nbsp;{!supportedChainIds.includes(Number(val.id)) && "(Coming soon)"}</code>
          </div>
        );
      })}
    </div>
  );

  const renderUserWalletStatus = (
    <div className="user_wallet_status">
      <div>
        <div style={{ position: "relative" }}>
          <Text>Metamask</Text>
          <Text style={{ marginTop: 8 }}>
            <Text component="span" className="net-selection" onClick={() => setToggleSwitchNetwork(!toggleSwitchNetwork)} >Select Network<i></i></Text>
            <a href="https://youtu.be/F74ayyxlRYk" tarkget="_blank" rel="noreferrer" style={{ display: "flex" }}>
              <img
                src={refresh}
                alt="tutorial"
                style={{ cursor: "pointer", width: 22 }}
              />
            </a>

          </Text>
          {toggleSwitchNetwork && renderSwitchNetwork}
        </div>
        <img src={metamask} alt="metamask logo" width={35} />
      </div>
      <Text component="span" variant="primary">{networkName}</Text>
      <Text className="account_info">
        {
          !account ? <Text component="span" style={{ fontSize: 11 }}>No account</Text> : <Text component="span" style={{ fontSize: 11 }}>{`${account?.slice(
            0,
            4
          )}....${account?.slice(account?.length - 12)}`}</Text>
        }
        <CopyToClipboard text={account}>
          <img
            src={copy}
            alt="copy"
            width={24}
            onClick={() => handleCopy()}
            style={{ cursor: "pointer" }}
          />
        </CopyToClipboard>
        <span className={isCopied ? "copy_text active" : "copy_text"}>
          copied
        </span>
      </Text>
      <Text style={{ fontWeight: 600 }}>{balance ? balance.toString().slice(0, 7) : 0} {symbol ? symbol : ""}</Text>
    </div>
  );

  const renderRecentActivities = (
    <div className="recent_activity">
      <Text variant="primary" style={{ marginBottom: 15 }}>
        Upcoming features
      </Text>
      {upcomingFeatures.map((val, index) => {
        return (
          <div className="details" key={index}>
            <img src={notification} alt="icons" width={40} />
            <Text>{val}</Text>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className={userState?.isSidebar ? "profile active" : "profile"}>
        {renderUserWalletStatus}
        {renderRecentActivities}
      </div>
      <div
        className={
          userState?.isSidebar ? "profile_backdrop active" : "profile_backdrop"
        }
        onClick={() =>
          userDispatch({
            type: "SIDEBAR",
            payload: { isSidebar: !userState?.isSidebar },
          })
        }
      ></div>
    </>
  );
};

export default Profile;
