import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import Genre from "./Genre";
import Rating from "./Rating";
import Icons from "./Icons";
import ActorRow from "./ActorRow";
import ShowRow from "./ShowRow";
import MovieRow from "./MovieRow";
import RatingView from "./RatingView";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class ShowView extends Component {
  constructor(props) {
    super(props);
    this.iconElement = React.createRef();
  }

  state = {
    token: this.props.cookies.get("recapp-token"),
    user_profile: {
      username: "",
      image: "",
      def_image: "",
      highest_genre: "",
      highest_movie: "",
    },
    show_id: this.props.cookies.get("show-id"),
    show_name: "",
    show_img: "",
    show_backdrop: "",
    show_desc: "",
    show_actors: [],
    show_crew: [],
    show_genres: [],
    show_rating: "",
    show_release: "",
    similar_shows: [],
    show_gotten: false,
    show_state: "",
    is_favorite: "",
    user_show_rating: "",
    user_show_review: "",
    search_results: [],
    display_rating: false,
    rating_updated: false,
    account_dropdown_visible: false,
  };

  showRating() {
    this.setState({ display_rating: true });
  }

  hideRating(reason, value, review) {
    if (reason === "close_btn") {
      this.setState({ display_rating: false });
    } else if (reason === "submit_btn") {
      this.iconElement.current.updateState(2);
      this.setState({
        display_rating: false,
        user_show_rating: value,
        user_show_review: review,
        rating_updated: true,
      });
    }
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
        this.setState({
          user_profile: {
            username: this.props.cookies.get("recapp-username"),
            image: process.env.REACT_APP_API_URL + results.image,
            def_image: process.env.REACT_APP_API_URL + results.def_image,
            highest_genre: results.highest_rated_genre,
            highest_movie: results.highest_rated_movie,
          },
        });
      })
      .catch((err) => console.log(err));
  }

  getShowState() {
    const showInfoURL = `${process.env.REACT_APP_API_URL}/api/mark/${this.state.show_id}/get_movie_state/`;
    fetch(showInfoURL, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({
          show_state: res.movie_state.state,
          is_favorite: res.movie_state.is_favorite,
          user_show_rating: res.movie_state.rating,
        });
        if (this.state.show_state === 2) {
          this.setState({ rating_updated: true });
        }
        this.getProfileInformation();
        this.getShowInfo();
        this.getSimilarShow();
        this.getShowCredits();
      })
      .catch((err) => {
        console.log(err);
        this.getProfileInformation();
        this.getShowInfo();
        this.getSimilarShow();
        this.getShowCredits();
      });
  }

  getShowInfo() {
    const showInfoURL = `https://api.themoviedb.org/3/tv/${this.state.show_id}?api_key=c69a9bc66efca73bdac1c765494a3655`;
    fetch(showInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res;
        var poster =
          "https://image.tmdb.org/t/p/original" + results.poster_path;

        var backdrop =
          "https://image.tmdb.org/t/p/original" + results.backdrop_path;

        this.setState({
          show_name: results.name,
          show_img: poster,
          show_desc: results.overview,
          show_rating: results.vote_average,
          show_gotten: true,
          show_genres: results.genres,
          show_backdrop: backdrop,
          show_release: results.first_air_date,
        });
      })
      .catch((err) => console.log(err));
  }
  getSimilarShow() {
    var similar = [];
    const movieInfoURL = `https://api.themoviedb.org/3/tv/${this.state.show_id}/recommendations?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    fetch(movieInfoURL, {
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
          similar.push(showRow);

          //}
        });
        this.setState({
          similar_shows: similar,
        });
      })
      .catch((err) => console.log(err));
  }

  getShowCredits() {
    var show_actors = [];
    const showInfoURL = `https://api.themoviedb.org/3/tv/${this.state.show_id}/credits?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    fetch(showInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res;
        var cast = results.cast;
        var cast_cap = 0;
        if (cast.length <= 10) {
          cast_cap = cast.length;
        } else {
          cast_cap = 10;
        }
        var counter = 0;
        do {
          if (counter < cast_cap) {
            var current_cast = cast[counter];
            var image_path =
              "https://image.tmdb.org/t/p/original" + current_cast.profile_path;
            var actor_row = (
              <ActorRow
                image={image_path}
                def_image={this.state.user_profile.def_image}
                name={current_cast.name}
                character={current_cast.character}
                actor_id={current_cast.id}
              />
            );
            show_actors.push(actor_row);
          }
          counter++;
        } while (counter <= cast_cap - 1);
        this.setState({
          show_actors: show_actors,
          //movie_crew: crew
        });
      })
      .catch((err) => console.log(err));
  }
  sanitizeRelease(date) {
    let split_date = date.split("-");
    return split_date[1] + "/" + split_date[2] + "/" + split_date[0];
  }
  sanitizeRuntime(runtime) {
    let minutes = runtime % 60;
    let hours = parseInt(runtime / 60);
    return hours + "h " + minutes + "m";
  }
  chooseRatingColor(rating) {
    if (rating <= 4.0) {
      return "red";
    } else if (rating <= 6.9) {
      return "yellow";
    } else if (rating <= 7.9) {
      return "yellowgreen";
    } else {
      return "green";
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
    if (searchTerm === "") {
      this.setState({
        search_results: [],
      });
    } else {
      boundObject.performSearch(searchTerm);
    }
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

  componentDidMount() {
    this.getShowState();
  }

  render() {
    return (
      <div className="wrapper">
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
              <p
                className="non-user-nav-text"
                style={{ "margin-left": "10px" }}
              >
                FILMS
              </p>
            </Link>
            <Link to="/shows" className="navbar-inactive non-user-nav-wrapper">
              <p
                className="non-user-nav-text"
                style={{ "margin-right": "10px" }}
              >
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
        {this.state.show_gotten && (
          <React.Fragment>
            <div className="movie-view-backdrop">
              {this.state.show_backdrop ===
              "https://image.tmdb.org/t/p/originalnull" ? (
                <div className="default-view-backdrop"></div>
              ) : (
                <img alt="show-backdrop" src={this.state.show_backdrop} />
              )}
            </div>
            <div className="movie-view-overlay"></div>
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
              className="movie-view-wrapper"
              onClick={() => {
                document.getElementById("search-results").style.display =
                  "none";
              }}
            >
              <div className="row-1">
                <div className="r1-col-1">
                  <div className="movie-img-wrapper">
                    {this.state.show_img ===
                    "https://image.tmdb.org/t/p/originalnull" ? (
                      <div className="default-view-poster">
                        <p className="default-view-poster-name">
                          No Poster Found
                        </p>
                      </div>
                    ) : (
                      <img
                        alt="show-view"
                        className="movie-view-img"
                        src={this.state.show_img}
                      />
                    )}
                  </div>
                </div>
                <div className="r1-col-2">
                  <p className="movie-title">{this.state.show_name} </p>
                  <div className="movie-rating">
                    Rating: <Rating rating={this.state.show_rating} />
                    <Icons
                      item_id={this.state.show_id}
                      state={this.state.show_state}
                      is_favorite={this.state.is_favorite}
                      media_type="tv"
                      callback_function={this.showRating.bind(this)}
                      ref={this.iconElement}
                    />
                  </div>
                  <div className="movie-year">
                    <p>{this.sanitizeRelease(this.state.show_release)}</p>
                    <div className="movie-genres">
                      {this.state.show_genres.map((g) => {
                        return <Genre genre={g} />;
                      })}
                    </div>
                  </div>
                  <div className="movie-descr">
                    <p>Overview</p>
                    {this.state.show_desc}
                  </div>
                  {this.state.rating_updated && (
                    <div className="review-wrapper">
                      <p className="review-header">Your rating:</p>
                      <div className="user-rating-wrapper">
                        <Rating rating={this.state.user_show_rating / 10} />
                      </div>
                      <p
                        className="review-link"
                        onClick={() => this.showRating()}
                      >
                        see your full review.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="row-2">
                <p className="cast-header">CAST</p>
                {this.state.show_actors.length > 0 ? (
                  <div className="results-row">{this.state.show_actors}</div>
                ) : (
                  <div className="results-row">
                    <p className="empty-actors">No Cast Information Found</p>
                  </div>
                )}
                <p className="cast-header">SIMILAR SHOWS</p>
                {this.state.similar_shows.length > 0 ? (
                  <div className="results-row">{this.state.similar_shows}</div>
                ) : (
                  <div className="results-row">
                    <p className="empty-actors">No Similar Shows Found</p>
                  </div>
                )}
              </div>
            </div>
            {this.state.display_rating === true && (
              <RatingView
                movie_name={this.state.show_name}
                movie_year=""
                callback_function={this.showRating.bind(this)}
                hide_function={this.hideRating.bind(this)}
                poster_src={this.state.show_img}
                item_id={this.state.show_id}
                state={this.state.show_state}
                media_type="tv"
                token={this.state.token}
                user_rating={this.state.user_show_rating}
                review={this.state.user_show_review}
              />
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withCookies(ShowView);
