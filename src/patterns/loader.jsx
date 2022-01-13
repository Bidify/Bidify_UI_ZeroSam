import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";

//IMPORTING MEDIA ASSETS

// import loader from "../assets/icons/loader.svg";
import ethLoader from "../assets/icons/loader_3d.gif";
import egemLoader from "../assets/icons/loader_3d_egem.gif";

const Loader = () => {
  const [loadGif, setLoadGif] = useState(ethLoader);
  const { account, chainId } = useWeb3React();
  useEffect(() => {
    if(account) {
      switch(chainId) {
        case 1: case 3: case 4: case 5: case 42:
          setLoadGif(ethLoader)
          break;
        case 1987:
          setLoadGif(egemLoader)
          break;
      }
    }
  }, [account])
  return (
    <div className="loader">
      <img src={loadGif} alt="loader" style={{ width: "8em" }} />
    </div>
  );
};

export default React.memo(Loader);
