import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import Explore from "./components/Explore";
import Landing from "./components/Landing";
import MovieView from "./components/MovieView";
import ShowLanding from "./components/ShowLanding";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { CookiesProvider } from "react-cookie";
import Profile from "./components/Profile";
import ShowView from "./components/ShowView";
import ActorView from "./components/ActorView";

const routing = (
  <BrowserRouter>
    <CookiesProvider>
      <Route exact path="/" component={App} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/explore" component={Explore} />
      <Route exact path="/landing" component={Landing} />
      <Route exact path="/movie" component={MovieView} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/shows" component={ShowLanding} />
      <Route exact path="/show" component={ShowView} />
      <Route exact path="/actor" component={ActorView} />
    </CookiesProvider>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById("root"));

serviceWorker.unregister();
