import React from "react";

//IMPORTING MEDIA ASSETS

// import loader from "../assets/icons/loader.svg";
import loader from "../assets/icons/loader_3d.gif";

const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="loader" style={{ width: "8em" }} />
    </div>
  );
};

export default React.memo(Loader);
