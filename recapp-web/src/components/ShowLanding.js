import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import ShowRow from "./ShowRow";
import MovieRow from "./MovieRow";
import { withCookies } from "react-cookie";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class ShowLanding extends Component {
  constructor(props) {
    super(props);
    this.loadShows();
  }

  state = {
    token: this.props.cookies.get("recapp-token"),
    user_profile: {
      username: "",
      image: "",
      movies_watched: "",
      shows_watched: "",
    },
    most_recent_show: "",
    search_results: [],
    shows_on_air: [],
    shows_trending: [],
    account_dropdown_visible: false,
  };

  loadShows() {
    const ontheair = [];
    const trending = [];

    //Get on the air now
    const theatersURLString =
      "https://api.themoviedb.org/3/tv/on_the_air?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&page=1";
    fetch(theatersURLString, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;
        results.forEach((show) => {
          show.poster_src =
            "https://image.tmdb.org/t/p/original" + show.poster_path;
          //if (this.imageExists(movie.poster_src)) {
          const showRow = <ShowRow key={show.id} show={show} />;
          ontheair.push(showRow);
          //}
        });
        this.setState({
          shows_on_air: ontheair,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Get trending shows this week
    const trendingURLString =
      "https://api.themoviedb.org/3/trending/tv/week?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&page=1";
    fetch(trendingURLString, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;
        results.forEach((show) => {
          show.poster_src =
            "https://image.tmdb.org/t/p/original" + show.poster_path;
          //if (this.imageExists(movie.poster_src)) {
          const showRow = <ShowRow key={show.id} show={show} />;
          trending.push(showRow);
          //}
        });
        this.setState({
          shows_trending: trending,
        });
      })
      .catch((err) => console.log(err));
  }

  getProfileInformation() {
    //GET request to db to get Profile Model which is auto-created once a user registers
    const urlString = `${process.env.REACT_APP_API_URL}/api/userprofile/get_user_profile/`;
    fetch(urlString, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.user_profile;
        let latest_show = "";
        if (results.most_recent_show !== "") {
          latest_show = results.most_recent_show;
        }
        this.setState({
          user_profile: {
            username: this.props.cookies.get("recapp-username"),
            image: process.env.REACT_APP_API_URL + results.image,
            movies_watched: results.movies_watched,
            shows_watched: results.shows_watched,
          },
          most_recent_show: latest_show,
        });
        if (latest_show !== "") {
          this.getRecentWatch();
        }
      })
      .catch((err) => console.log(err));
  }

  getRecentWatch() {
    const movieInfoURL = `https://api.themoviedb.org/3/tv/${this.state.most_recent_show}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    fetch(movieInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res;
        this.setState({
          most_recent_show: results,
        });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    if (this.state.token) {
      this.getProfileInformation();
    } else {
      window.href.location("/login");
    }
  }

  performSearch(searchTerm) {
    const search_results = [];
    const urlString = `https://api.themoviedb.org/3/search/multi?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&query=${searchTerm}&page=1&include_adult=false`;
    fetch(urlString, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;

        results.forEach((result) => {
          if (result.media_type === "movie") {
            result.poster_src =
              "https://image.tmdb.org/t/p/original" + result.poster_path;
            //if (this.imageExists(movie.poster_src)) {
            const movieRow = (
              <MovieRow key={result.id} movie={result} info={"none"} />
            );
            search_results.push(movieRow);
            //}
          } else if (result.media_type === "tv") {
            result.poster_src =
              "https://image.tmdb.org/t/p/original" + result.poster_path;
            const showRow = <ShowRow key={result.id} show={result} />;
            search_results.push(showRow);
          }
        });
        this.setState({
          search_results: search_results,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  searchChangeHandler(event) {
    const boundObject = this;
    const searchTerm = event.target.value;
    boundObject.performSearch(searchTerm);
  }

  logout() {
    cookies.remove("recapp-token", { path: "/" });
    cookies.remove("recapp-username", { path: "/" });
    window.location.href = "/";
  }

  showAccountDropdown() {
    this.setState({ account_dropdown_visible: true });
  }

  hideAccountDropdown() {
    let items_hovering = document.querySelectorAll(":hover");
    let length = items_hovering.length;
    if (
      document.querySelectorAll(":hover")[length - 1] === undefined ||
      document.querySelectorAll(":hover")[length - 1].tagName === "iframe"
    ) {
      this.setState({ account_dropdown_visible: false });
    } else {
      let class_name = document.querySelectorAll(":hover")[length - 1]
        .className;
      if (class_name !== "account-logout-btn" || class_name === "undefined") {
        this.setState({ account_dropdown_visible: false });
      }
    }
  }

  render() {
    return (
      <div className="explore-1-wrapper">
        <Navbar
          className="title-bar"
          style={{ position: "fixed", top: 0, padding: 0 }}
        >
          <Nav className="mr-auto">
            <Link to="/landing" className="explore-navbar-logo">
              <i className="fas fa-video explore-logo-icon align-vertically"></i>

              <p className="explore-logo-text">RECAPP</p>
            </Link>
            <Link
              to="/landing"
              className="navbar-inactive non-user-nav-wrapper"
            >
              <p className="non-user-nav-text" style={{ marginLeft: "10px" }}>
                FILMS
              </p>
            </Link>
            <Link to="/shows" className="navbar-active non-user-nav-wrapper">
              <p className="non-user-nav-text" style={{ marginRight: "10px" }}>
                SHOWS
              </p>
            </Link>
            <div className="search-bar-wrapper">
              <i className="fas fa-search"></i>
              <input
                className="search-bar"
                placeholder="Search..."
                onClick={() => {
                  document.getElementById("search-results").style.display =
                    "block";
                }}
                onChange={this.searchChangeHandler.bind(this)}
              ></input>
            </div>
          </Nav>
          <Nav className="ml-auto nav-right nav-info">
            <Link
              to="/profile"
              className="navbar-inactive user-nav-wrapper "
              onMouseEnter={() => this.showAccountDropdown()}
              onMouseLeave={() => this.hideAccountDropdown()}
            >
              <div className="nav-pic-wrapper">
                <img
                  alt="user-profile"
                  className="nav-user-profile-pic"
                  src={this.state.user_profile.image}
                />
              </div>
            </Link>
          </Nav>
        </Navbar>
        {this.state.account_dropdown_visible && (
          <div id="account-dropdown">
            <div
              className="account-dropdown-item"
              onMouseLeave={() => this.hideAccountDropdown()}
            >
              <p className="account-logout-btn" onClick={() => this.logout()}>
                LOG OUT
              </p>
            </div>
          </div>
        )}
        <div className="landing-wrapper">
          <div className="landing-backdrop">
            {this.state.most_recent_show !== "" ? (
              <img
                alt="latest-show"
                src={
                  "https://image.tmdb.org/t/p/original" +
                  this.state.most_recent_show.backdrop_path
                }
              />
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </div>
          <div className="landing-backdrop-overlay"></div>
          <div id="search-results">
            <Animated
              animationIn="fadeIn"
              animationInDuration={300}
              animationOut="fadeOut"
              isVisible={true}
              className="search-results-content"
            >
              <p className="search-results-header">Search Results</p>
              <div className="results">{this.state.search_results}</div>
            </Animated>
          </div>
          <div
            className="l-content-wrapper"
            onClick={() => {
              document.getElementById("search-results").style.display = "none";
            }}
          >
            <div className="user-col-2">
              <div className="landing-left">
                <p className="recent-img-overlay-text">LATEST WATCH </p>
                <p className="landing-recent-movie-title">
                  {this.state.most_recent_show === "" ? (
                    <p>None yet :(</p>
                  ) : (
                    this.state.most_recent_show.name
                  )}
                  {}
                </p>
              </div>
            </div>
            <div className="lists-wrapper">
              <div className="lists-wrapper-left">
                <div className="landing-text-wrapper">
                  <p className="landing-text">POPULAR SHOWS</p>
                </div>
                <div className="movie-carousel">
                  <div className="list-movie-wrapper">
                    {this.state.shows_trending}
                  </div>
                </div>
                <div className="landing-text-wrapper landing-bottom">
                  <p className="landing-text">SHOWS ON THE AIR</p>
                </div>
                <div className="movie-carousel">
                  <div className="list-movie-wrapper">
                    {this.state.shows_on_air}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(ShowLanding);
