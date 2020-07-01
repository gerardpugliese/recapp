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

class MovieView extends Component {
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
    movie_id: this.props.cookies.get("movie-id"),
    movie_name: "",
    movie_img: "",
    movie_backdrop: "",
    movie_desc: "",
    movie_runtime: "",
    movie_actors: [],
    movie_crew: [],
    movie_genres: [],
    movie_tmdb_rating: "",
    movie_imdb_rating: "",
    movie_rottentomatoes_rating: "",
    movie_release: "",
    movie_year: "",
    similar_movies: [],
    movie_gotten: false,
    movie_state: "",
    movie_director: "",
    is_favorite: "",
    user_movie_rating: "",
    user_movie_review: "",
    search_results: [],
    show_rating: false,
    rating_updated: false,
    imdb_img:
      "https://firebasestorage.googleapis.com/v0/b/my-recapp.appspot.com/o/images%2Fimdb_logo.png?alt=media&token=04f41087-7552-4d33-8e8f-91e1aa43b19c",
    rottentomatoes_img:
      "https://firebasestorage.googleapis.com/v0/b/my-recapp.appspot.com/o/images%2Ftomato-svg-logo-2.png?alt=media&token=5c874fca-90ba-4802-8541-9fa32bf05f1b",
    account_dropdown_visible: false,
  };

  showRating() {
    this.setState({ show_rating: true });
  }

  hideRating(reason, value, review) {
    if (reason === "close_btn") {
      this.setState({ show_rating: false });
    } else if (reason === "submit_btn") {
      this.iconElement.current.updateState(2);
      this.setState({
        show_rating: false,
        user_movie_rating: value,
        rating_updated: true,
        user_movie_review: review,
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
          recent_movie: results.most_recent_movie,
        });
      })
      .catch((err) => console.log(err));
  }

  getMovieState() {
    const movieInfoURL = `${process.env.REACT_APP_API_URL}/api/mark/${this.state.movie_id}/get_movie_state/`;
    fetch(movieInfoURL, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({
          movie_state: res.movie_state.state,
          is_favorite: res.movie_state.is_favorite,
          user_movie_rating: res.movie_state.rating,
          user_movie_review: res.movie_state.review,
        });

        if (this.state.movie_state === 2) {
          this.setState({
            rating_updated: true,
            movie_state: res.movie_state.state,
          });
        }

        this.getProfileInformation();
        this.getMovieInfo();
        this.getSimilarMovie();
        this.getMovieCredits();
        this.getRatingImages();
      })
      .catch((err) => {
        console.log(err);
        this.getProfileInformation();
        this.getMovieInfo();
        this.getSimilarMovie();
        this.getMovieCredits();
      });
  }

  getMovieInfo() {
    var imdbID = "";
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${this.state.movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    fetch(movieInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res;
        imdbID = results.imdb_id;
        var poster =
          "https://image.tmdb.org/t/p/original" + results.poster_path;
        var backdrop =
          "https://image.tmdb.org/t/p/original" + results.backdrop_path;
        this.setState({
          movie_name: results.title,
          movie_img: poster,
          movie_desc: results.overview,
          movie_runtime: results.runtime,
          movie_tmdb_rating: results.vote_average,
          movie_gotten: true,
          movie_genres: results.genres,
          movie_backdrop: backdrop,
          movie_release: results.release_date,
          movie_year: results.release_date.split("-")[0],
        });
        this.getIMDBInfo(imdbID);
      })
      .catch((err) => console.log(err));
  }

  getIMDBInfo(imdbID) {
    var imdb_rating = "";
    var rottentomatoes_rating = "";
    var director = "";
    const imdbInfoURL = `https://www.omdbapi.com/?i=${imdbID}&apikey=f8dd8e76`;
    fetch(imdbInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        director = res.Director;
        res.Ratings.forEach((rating) => {
          if (rating.Source === "Rotten Tomatoes") {
            rottentomatoes_rating = rating.Value;
          } else if (rating.Source === "Internet Movie Database") {
            imdb_rating = rating.Value;
            imdb_rating = imdb_rating.split("/")[0];
          }
        });
        this.setState({
          movie_imdb_rating: imdb_rating,
          movie_rottentomatoes_rating: rottentomatoes_rating,
          movie_director: director,
        });
      })
      .catch((err) => console.log(err));
  }

  getSimilarMovie() {
    var similar = [];
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${this.state.movie_id}/recommendations?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    fetch(movieInfoURL, {
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
          similar.push(movieRow);

          //}
        });
        this.setState({
          similar_movies: similar,
        });
      })
      .catch((err) => console.log(err));
  }

  getMovieCredits() {
    var movie_actors = [];
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${this.state.movie_id}/credits?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    fetch(movieInfoURL, {
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
            movie_actors.push(actor_row);
          }

          counter++;
        } while (counter <= cast_cap - 1);
        this.setState({
          movie_actors: movie_actors,
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

  componentDidMount() {
    this.getMovieState();
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
          <Nav className=" ml-auto nav-right nav-info">
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
        {this.state.movie_gotten && (
          <React.Fragment>
            <div className="movie-view-backdrop">
              {this.state.movie_backdrop ===
              "https://image.tmdb.org/t/p/originalnull" ? (
                <div className="default-view-backdrop"></div>
              ) : (
                <img alt="movie-backdrop" src={this.state.movie_backdrop} />
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
                    {this.state.movie_img ===
                    "https://image.tmdb.org/t/p/originalnull" ? (
                      <div className="default-view-poster">
                        <p className="default-view-poster-name">
                          No Poster Found
                        </p>
                      </div>
                    ) : (
                      <img
                        alt="movie-img"
                        className="movie-view-img"
                        src={this.state.movie_img}
                      />
                    )}
                  </div>
                </div>
                <div className="r1-col-2">
                  <p className="movie-title">{this.state.movie_name} </p>
                  <div className="movie-rating">
                    <img
                      className="rating-img-imdb"
                      alt="IMDb"
                      src={this.state.imdb_img}
                    />
                    {this.state.movie_imdb_rating === "" ? (
                      <p className="rating-placeholder">N/A</p>
                    ) : (
                      <Rating rating={this.state.movie_imdb_rating} />
                    )}

                    <img
                      className="rating-img-rotten-tomatoes"
                      alt="Rotten Tomatoes"
                      src={this.state.rottentomatoes_img}
                    />
                    {console.log(this.state.movie_rottentomatoes_rating === "")}
                    {this.state.movie_rottentomatoes_rating === "" ? (
                      <p className="rating-placeholder">N/A</p>
                    ) : (
                      <Rating rating={this.state.movie_rottentomatoes_rating} />
                    )}
                    <Icons
                      item_id={this.state.movie_id}
                      state={this.state.movie_state}
                      is_favorite={this.state.is_favorite}
                      media_type="movie"
                      callback_function={this.showRating.bind(this)}
                      ref={this.iconElement}
                    />
                  </div>
                  <div className="movie-year">
                    <p>{this.sanitizeRelease(this.state.movie_release)}</p>
                    <div className="movie-genres">
                      {this.state.movie_genres.map((g) => {
                        return <Genre genre={g} />;
                      })}
                    </div>
                    <p>{this.sanitizeRuntime(this.state.movie_runtime)}</p>
                  </div>
                  <p className="movie-director">
                    Director: {this.state.movie_director}
                  </p>
                  <p className="movie-descr">
                    <p>Overview</p>
                    {this.state.movie_desc}
                  </p>
                  {this.state.rating_updated && (
                    <div className="review-wrapper">
                      <p className="review-header">Your rating:</p>
                      <div className="user-rating-wrapper">
                        <Rating rating={this.state.user_movie_rating / 10} />
                      </div>
                      <p
                        className="review-link"
                        onClick={() => this.showRating()}
                      >
                        edit your review
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="row-2">
                <p className="cast-header">CAST</p>
                {this.state.movie_actors.length > 0 ? (
                  <div className="results-row">{this.state.movie_actors}</div>
                ) : (
                  <div className="results-row">
                    <p className="empty-actors">No Cast Information Found</p>
                  </div>
                )}
                <p className="cast-header">SIMILAR MOVIES</p>
                {this.state.similar_movies.length > 0 ? (
                  <div className="results-row">{this.state.similar_movies}</div>
                ) : (
                  <div className="results-row">
                    <p className="empty-actors">No Similar Movies Found</p>
                  </div>
                )}
              </div>
            </div>
            {this.state.show_rating === true && (
              <RatingView
                movie_name={this.state.movie_name}
                movie_year={this.state.movie_year}
                callback_function={this.showRating.bind(this)}
                hide_function={this.hideRating.bind(this)}
                poster_src={this.state.movie_img}
                item_id={this.state.movie_id}
                state={this.state.movie_state}
                media_type="movie"
                token={this.state.token}
                user_rating={this.state.user_movie_rating}
                review={this.state.user_movie_review}
              />
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withCookies(MovieView);
