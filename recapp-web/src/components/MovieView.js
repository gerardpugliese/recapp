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
    movie_rating: "",
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
  };

  showRating() {
    console.log("in show rating");
    this.setState({ show_rating: true });
  }

  hideRating(reason, value, review) {
    console.log("in hide rating");
    console.log(review);
    if (reason === "close_btn") {
      this.setState({ show_rating: false });
    } else if (reason === "submit_btn") {
      console.log("here in close submit");
      this.iconElement.current.updateState(2);
      this.setState({
        show_rating: false,
        user_movie_rating: value,
        rating_updated: true,
        user_movie_review: review,
      });
      console.log(this.state.user_movie_review);
    }
  }

  getProfileInformation() {
    //GET request to db to get Profile Model which is auto-created once a user registers
    const urlString = "http://127.0.0.1:8000/api/userprofile/get_user_profile/";
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
            image: "http://127.0.0.1:8000" + results.image,
            def_image: "http://127.0.0.1:8000" + results.def_image,
            highest_genre: results.highest_rated_genre,
            highest_movie: results.highest_rated_movie,
          },
          recent_movie: results.most_recent_movie,
        });
      })
      .catch((err) => console.log(err));
  }

  getMovieState() {
    const movieInfoURL = `http://127.0.0.1:8000/api/mark/${this.state.movie_id}/get_movie_state/`;
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
          this.setState({ rating_updated: true });
        }
      })
      .catch((err) => console.log(err));
  }

  getMovieInfo() {
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${this.state.movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    //console.log(movieInfoURL);
    fetch(movieInfoURL, {
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
          movie_name: results.title,
          movie_img: poster,
          movie_desc: results.overview,
          movie_runtime: results.runtime,
          movie_rating: results.vote_average,
          movie_gotten: true,
          movie_genres: results.genres,
          movie_backdrop: backdrop,
          movie_release: results.release_date,
          movie_year: results.release_date.split("-")[0],
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
    //console.log(movieInfoURL);
    fetch(movieInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res;
        var cast = results.cast;
        var crew = results.crew;
        var cast_cap = 0;
        if (cast.length <= 10) {
          cast_cap = cast.length;
        } else {
          cast_cap = 10;
        }
        var counter = 0;
        do {
          if (crew[counter].job === "Director") {
            this.setState({ movie_director: crew[counter].name });
          }

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
        console.log("upcoming error");
        console.log(err);
      });
  }

  searchChangeHandler(event) {
    console.log(event.target.value);
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
    this.getProfileInformation();
    this.getMovieInfo();
    this.getSimilarMovie();
    this.getMovieState();
    this.getMovieCredits();
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar
          className="title-bar"
          style={{ position: "fixed", top: 0, padding: 0 }}
        >
          <Animated
            animationIn="slideInLeft"
            animationInDuration={600}
            animationOut="fadeOut"
            isVisible={true}
            className="mr-auto"
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
              <Link
                to="/shows"
                className="navbar-inactive non-user-nav-wrapper"
              >
                <p
                  className="non-user-nav-text"
                  style={{ marginRight: "10px" }}
                >
                  TV SHOWS
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
          </Animated>

          <Animated
            animationIn="slideInRight"
            animationInDuration={800}
            animationOut="fadeOut"
            isVisible={true}
            className="ml-auto nav-right"
          >
            <Nav className="nav-info ">
              <Link to="/profile" className="navbar-inactive user-nav-wrapper ">
                <div className="nav-pic-wrapper">
                  <img
                    className="nav-user-profile-pic"
                    src={this.state.user_profile.image}
                  />
                </div>
              </Link>
            </Nav>
          </Animated>
        </Navbar>
        {this.state.movie_gotten && (
          <React.Fragment>
            <div className="movie-view-backdrop">
              {this.state.movie_backdrop ===
              "https://image.tmdb.org/t/p/originalnull" ? (
                <div className="default-view-backdrop"></div>
              ) : (
                <img src={this.state.movie_backdrop} />
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
                        className="movie-view-img"
                        src={this.state.movie_img}
                      />
                    )}
                  </div>
                </div>
                <div className="r1-col-2">
                  <p className="movie-title">{this.state.movie_name} </p>
                  <div className="movie-rating">
                    Rating: <Rating rating={this.state.movie_rating} />
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
