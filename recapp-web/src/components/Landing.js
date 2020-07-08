import React, { Component, useState, Fragment } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import MovieRow from "./MovieRow";
import ShowRow from "./ShowRow";
import { withCookies } from "react-cookie";
import Cookies from "universal-cookie";
import { storage } from "../firebase";

const cookies = new Cookies();

class Landing extends Component {
  constructor(props) {
    super(props);
    this.loadMovies();
  }

  state = {
    token: this.props.cookies.get("recapp-token"),
    interested: [],
    watched: [],
    popular: [],
    in_theaters: [],
    user_profile: {
      username: "",
      movies_watched: "",
      shows_watched: "",
      highest_rated_movie: "",
      highest_rated_show: "",
    },
    profile_image: "",
    first_login: "",
    most_recent_movie: "",
    similar_movies: [],
    search_results: [],
    account_dropdown_visible: false,
    profile_picture: "",
    profile_picture_selected: false,
    profile_pic_name: "",
    default_profile_image:
      "https://firebasestorage.googleapis.com/v0/b/my-recapp.appspot.com/o/images%2Favatar.png?alt=media&token=9b08b6f9-dcd2-4244-b4a7-6f5511bdb82a",
  };

  loadMovies() {
    const nowplaying = [];
    const popular = [];

    //Get movies in theaters now
    const theatersURLString =
      "https://api.themoviedb.org/3/movie/now_playing?api_key=c69a9bc66efca73bdac1c765494a3655&region=US&with_release_type=2|3";
    fetch(theatersURLString, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;

        results.forEach((movie) => {
          movie.poster_src =
            "https://image.tmdb.org/t/p/original" + movie.poster_path;
          //if (this.imageExists(movie.poster_src)) {
          const movieRow = (
            <MovieRow key={movie.id} movie={movie} info={"none"} />
          );
          nowplaying.push(movieRow);
          //}
        });
        this.setState({
          in_theaters: nowplaying,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Get movies that are popular now
    const upcomingURLString =
      "https://api.themoviedb.org/3/trending/movie/week?api_key=c69a9bc66efca73bdac1c765494a3655&region=US&with_release_type=2|3";
    fetch(upcomingURLString, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;
        results.forEach((movie) => {
          movie.poster_src =
            "https://image.tmdb.org/t/p/original" + movie.poster_path;
          //if (this.imageExists(movie.poster_src)) {
          const movieRow = (
            <MovieRow key={movie.id} movie={movie} info={"none"} />
          );
          popular.push(movieRow);
          this.setState({
            popular: popular,
          });
          // }
        });
      })
      .catch((err) => console.log(err));
  }

  getInterestedMovies() {
    const urlString = `${process.env.REACT_APP_API_URL}/api/mark/get_interested_list/`;
    fetch(urlString, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.interested_list;
        var movieResults = [];

        results.forEach((movie) => {
          const movieInfoURL = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
          fetch(movieInfoURL, {
            method: "GET",
          })
            .then((resp) => resp.json())
            .then((res) => {
              const results = res;

              results.poster_src =
                "https://image.tmdb.org/t/p/original" + results.poster_path;
              const movieRow = (
                <MovieRow
                  key={results.id}
                  movie={results}
                  info={"nowplaying"}
                />
              );
              movieResults.unshift(movieRow);
              this.setState({ interested: movieResults });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getWatchedMovies() {
    let mostRecent = [];
    const urlString = `${process.env.REACT_APP_API_URL}/api/mark/get_watched_list/`;
    fetch(urlString, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.watched_list;
        var movieResults = [];
        results.forEach((movie) => {
          const movieInfoURL = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
          fetch(movieInfoURL, {
            method: "GET",
          })
            .then((resp) => resp.json())
            .then((res) => {
              const results = res;

              results.poster_src =
                "https://image.tmdb.org/t/p/original" + results.poster_path;
              const movieRow = (
                <MovieRow
                  key={results.id}
                  movie={results}
                  info={"nowplaying"}
                />
              );
              movieResults.unshift(movieRow);
              mostRecent = movieResults[0];
              this.setState({
                watched: movieResults,
                recent_movie: mostRecent.key,
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
        let latest_movie = "";
        if (results.most_recent_movie !== "") {
          latest_movie = results.most_recent_movie;
        }
        this.setState({
          user_profile: {
            username: this.props.cookies.get("recapp-username"),
            movies_watched: results.movies_watched,
            shows_watched: results.shows_watched,
          },
          profile_image: results.image,
          first_login: results.first_login,
          most_recent_movie: latest_movie,
        });
        if (latest_movie !== "") {
          this.getRecentWatch();
        }
      })
      .catch((err) => console.log(err));
  }

  getRecentWatch() {
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${this.state.most_recent_movie}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    fetch(movieInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res;
        this.setState({
          most_recent_movie: results,
        });
      })
      .catch((err) => console.log(err));
    this.getSimilarMovie();
  }

  getSimilarMovie() {
    var similar = "";
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${this.state.most_recent_movie}/similar?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    fetch(movieInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;
        var movie_result = results[0];
        movie_result.poster_src =
          "https://image.tmdb.org/t/p/original" + movie_result.poster_path;

        const movieRow = (
          <MovieRow
            key={movie_result.id}
            token={this.state.token}
            movie={movie_result}
            info={"none"}
          />
        );
        similar = movieRow;
        this.setState({
          similar_movies: similar,
        });
        // }
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    if (this.state.token) {
      this.getProfileInformation();
    } else {
      window.location.href = "/login";
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

  handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      this.setState({
        profile_picture: e.target.files[0],
        profile_pic_name: e.target.files[0].name,
        profile_picture_selected: true,
      });
    }

    console.log(e.target.files[0]);
  };

  handleProfilePicUpload = () => {
    let profile_pic = this.state.profile_picture;
    const uploadTask = storage
      .ref(`images/${profile_pic.name}`)
      .put(profile_pic);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(profile_pic.name)
          .getDownloadURL()
          .then((url) => {
            const urlString = `${process.env.REACT_APP_API_URL}/api/userprofile/set_profile_image/`;
            fetch(urlString, {
              method: "POST",
              headers: {
                Authorization: `Token ${this.state.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: url,
              }),
            })
              .then((resp) => resp.text())
              .then((res) => {
                console.log(res);
                this.setState({ profile_image: url, first_login: false });
              })
              .catch((err) => console.log(err));
          });
      }
    );
  };

  handlePicIgnore() {
    this.setState({
      first_login: false,
    });
    const urlString = `${process.env.REACT_APP_API_URL}/api/userprofile/negate_first_login/`;
    fetch(urlString, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {})
      .catch((err) => console.log(err));
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
              <i className="fas fa-video  explore-logo-icon align-vertically"></i>

              <p className="explore-logo-text">RECAPP</p>
            </Link>
            <Link to="/landing" className="navbar-active non-user-nav-wrapper">
              <p className="non-user-nav-text" style={{ marginLeft: "10px" }}>
                FILMS
              </p>
            </Link>
            <Link to="/shows" className="navbar-inactive non-user-nav-wrapper">
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
              className="navbar-active user-nav-wrapper "
              onMouseEnter={() => this.showAccountDropdown()}
              onMouseLeave={() => this.hideAccountDropdown()}
            >
              <div className="nav-pic-wrapper">
                {this.state.profile_image === "" ? (
                  <img
                    alt="user-profile"
                    className="nav-user-profile-pic"
                    src={this.state.default_profile_image}
                  />
                ) : (
                  <img
                    alt="user-profile"
                    className="nav-user-profile-pic"
                    src={this.state.profile_image}
                  />
                )}
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
            {this.state.most_recent_movie !== "" ? (
              <img
                alt="latest-movie"
                src={
                  "https://image.tmdb.org/t/p/original" +
                  this.state.most_recent_movie.backdrop_path
                }
              />
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </div>
          <div className="landing-backdrop-overlay"></div>
          {this.state.first_login === true && (
            <div className="first-login-wrapper">
              <div className="first-login-content">
                <p className="first-login-text">
                  Welcome to <p className="first-login-logo">RECAPP</p>!
                </p>
                <p className="first-login-upload-link">
                  Choose a profile picture.
                </p>
                <input
                  className="first-login-input"
                  type="file"
                  name="file"
                  id="file"
                  onChange={this.handleProfilePicChange}
                />
                <label for="file">
                  <i className="fas fa-image first-login-icon"></i>
                  Pick an image
                </label>
                <br />
                {this.state.profile_picture_selected === true && (
                  <div className="first-login-confirm-pic">
                    <p className="first-login-pic-name">
                      {this.state.profile_pic_name}
                    </p>
                    <button
                      className="first-login-button"
                      onClick={this.handleProfilePicUpload}
                    >
                      Confirm
                    </button>
                  </div>
                )}
                {this.state.profile_picture_selected === false && (
                  <Fragment>
                    <p className="first-login-upload-link">OR</p>
                    <p
                      className="first-login-ignore-link"
                      onClick={this.handlePicIgnore.bind(this)}
                    >
                      Set it up later.
                    </p>
                  </Fragment>
                )}
              </div>
            </div>
          )}
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
                  {this.state.most_recent_movie === "" ? (
                    <p>None yet :(</p>
                  ) : (
                    this.state.most_recent_movie.title
                  )}
                </p>
              </div>
            </div>
            <div className="lists-wrapper">
              <div className="lists-wrapper-left">
                <div className="landing-text-wrapper">
                  <p className="landing-text">POPULAR MOVIES</p>
                </div>
                <div className="movie-carousel">
                  <div className="list-movie-wrapper">{this.state.popular}</div>
                </div>
                <div className="landing-text-wrapper landing-bottom">
                  <p className="landing-text">MOVIES IN THEATERS</p>
                </div>
                <div className="movie-carousel">
                  <div className="list-movie-wrapper">
                    {this.state.in_theaters}
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

export default withCookies(Landing);
