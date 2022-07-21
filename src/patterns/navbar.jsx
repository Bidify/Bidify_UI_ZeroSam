import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

//IMPORTING STYLESHEET

import "../styles/patterns/navbar.scss";

//IMPORTING MEDIA ASSETS

import dashboardActive from "../assets/icons/dashboardActive.svg";
import biddingActive from "../assets/icons/biddingActive.svg";
import myCollectionActive from "../assets/icons/myCollectionActive.svg";
import NFTActive from "../assets/icons/NFTActive.svg";
//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";
import { useWeb3React } from "@web3-react/core";
import { Text } from "../components";
import { getSymbol, NetworkData } from "../utils/config";

const Navbar = () => {
  //INITIALIZING HOOKS
  const { chainId, account } = useWeb3React()
  const { userDispatch } = useContext(UserContext);

  const renderLogo = (
    <div className="logo">
      <img src={NetworkData[(account ? chainId : 4)].logo} alt="logo" width={48} />
      <Text variant="primary">{getSymbol(chainId)}</Text>
    </div>
  );

  const renderMenu = (
    <ul className="nav_menu">
      <li className="nav_items">
        <NavLink
          to="/"
          exact
          activeClassName="active"
          onClick={() =>
            userDispatch({
              type: "SIDEBAR",
              payload: { isSidebar: false },
            })
          }
        >
          <img src={dashboardActive} alt="menu" />
        </NavLink>
      </li>
      <li className="nav_items">
        <NavLink
          to="/mycollections"
          exact
          activeClassName="active"
          onClick={() =>
            userDispatch({
              type: "SIDEBAR",
              payload: { isSidebar: false },
            })
          }
        >
          <img src={myCollectionActive} alt="menu" />
        </NavLink>
      </li>
      <li className="nav_items">
        <NavLink
          to="/marketplace"
          exact
          activeClassName="active"
          onClick={() =>
            userDispatch({
              type: "SIDEBAR",
              payload: { isSidebar: false },
            })
          }
        >
          <img src={NFTActive} alt="menu" />
        </NavLink>
      </li>
      <li className="nav_items">
        <NavLink
          to="/mybiddings"
          exact
          activeClassName="active"
          onClick={() =>
            userDispatch({
              type: "SIDEBAR",
              payload: { isSidebar: false },
            })
          }
        >
          <img src={biddingActive} alt="menu" />
        </NavLink>
      </li>
      {/* <li className="nav_items">
        <NavLink to="/settings" exact activeClassName="active">
          <img src={settingsActive} alt="menu" />
        </NavLink>
      </li> */}
    </ul>
  );

  return (
    <>
      <div className="navbar">
        {renderLogo}
        {renderMenu}
        <div className="flex"></div>
      </div>
    </>
  );
};

export default Navbar;
