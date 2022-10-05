import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

//IMPORTING PATTERN & PAGES

import Navbar from "./patterns/navbar";
import Profile from "./patterns/profile";
import HomeScreen from "./pages/homeScreen";
import Collection from "./pages/collection";
import MarketPlace from "./pages/marketPlace";
import DetailsPage from "./pages/detailsPage";
import Tutorials from "./pages/tutorials";
import PageNotFound from "./pages/pageNotFound";

import { useEagerConnect } from "./hooks/hooks";
import { useInactiveListener } from "./hooks/hooks";
import MyBiddings from "./pages/myBiddings";
import GA from './utils/GoogleAnalytics'
// import ReactGA from 'react-ga';

function App() {
  // useEffect(() => {
  //   const setGA = () => {
  //     ReactGA.initialize('UA-220342809-1');
  //     ReactGA.pageview('Init page view');
  //   };
  //   setGA();
  // }, [])
  const context = useWeb3React();
  const { connector } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <Router>
      { GA.init() && <GA.RouteTracker /> }
      <Navbar />
      <Profile />
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/mycollections" component={Collection} />
        <Route exact path="/marketplace" component={MarketPlace} />
        <Route exact path="/mybiddings" component={MyBiddings} />
        <Route exact path="/tutorials" component={Tutorials} />
        <Route exact path="/nft_details/:platform/:id" component={DetailsPage} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
}

export default App;
