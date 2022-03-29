import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

//STYLESHEET

import "../styles/pages/homepage.scss";

//IMPORTING PATTERNS

import { Text } from "../components";

//IMPORTING MEDIA ASSETS

import logo from "../assets/logo/bidifylogo.png";
import logo_egem from "../assets/logo/bidifylogo_egem.png";
import logo_avax from "../assets/logo/bidifylogo_avax.png";
import logo_matic from "../assets/logo/bidifylogo_matic.png";

import search from "../assets/icons/search.svg";
import hamburger from "../assets/icons/hamburger.svg";
import outline_close from "../assets/icons/outline_close.svg";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";
import { useWeb3React } from "@web3-react/core";

const Header = ({ title, description }) => {
  //INITIALIZING HOOKS
  const { chainId } = useWeb3React();
  const { userState, userDispatch } = useContext(UserContext);

  const searchRef = useRef();

  useEffect(() => {
    userDispatch({
      type: "RESET",
    });
  }, []);

  // HANDLING SEARCH METHOD

  const handleSearch = async (keyword) => {
    userDispatch({
      type: "SEARCH_AUCTIONS",
      payload: { keyword: keyword.current.value },
    });
  };

  const renderScreenHeader = (
    <div
      className={
        userState?.isSidebar ? "screen_header active" : "screen_header"
      }
    >
      <Link to="/" className="logo">
        <img src={chainId === 1987 ? logo_egem : chainId === 43114 ? logo_avax : (chainId === 137 || chainId === 80001) ? logo_matic : logo} alt="logo" width={48} />
        <Text variant="primary">{chainId === 1987 ? "EGEM" : chainId === 43114 ? "AVAX" : (chainId === 137 || chainId === 80001) ? "MATIC" : "ETH"}</Text>
      </Link>
      <div className="content">
        <Text variant="primary">{title}</Text>
        <Text>{description}</Text>
      </div>
      <div className="block_right">
        <div className="search_input">
          <input
            type="text"
            placeholder="Search NFTs"
            ref={searchRef}
            onChange={() => handleSearch(searchRef)}
          />
          <img src={search} alt="search" width={22} />
        </div>
        <img
          className="avatar"
          src={userState?.isSidebar ? outline_close : hamburger}
          alt="avatar"
          width={24}
          onClick={() =>
            userDispatch({
              type: "SIDEBAR",
              payload: { isSidebar: !userState?.isSidebar },
            })
          }
        />
      </div>
    </div>
  );
  return renderScreenHeader;
};

export default Header;
