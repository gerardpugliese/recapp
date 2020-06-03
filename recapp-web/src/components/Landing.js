import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import MovieRow from "./MovieRow";
import ShowRow from "./ShowRow";
import { withCookies } from "react-cookie";
import Profile from "./Profile";

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
      image: "",
      movies_watched: "",
      shows_watched: "",
      highest_rated_movie: "",
      highest_rated_show: "",
    },
    most_recent_movie: "",
    similar_movies: [],
    search_results: [],
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
          console.log(movie);
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
        console.log("upcoming error");
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
    const urlString = "http://127.0.0.1:8000/api/mark/get_interested_list/";
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
          //console.log(movieInfoURL);
          fetch(movieInfoURL, {
            method: "GET",
          })
            .then((resp) => resp.json())
            .then((res) => {
              const results = res;
              //console.log(results);

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
    const urlString = "http://127.0.0.1:8000/api/mark/get_watched_list/";
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
            movies_watched: results.movies_watched,
            shows_watched: results.shows_watched,
            highest_rated_movie: results.highest_rated_movie,
            highest_rated_show: results.highest_rated_show,
          },
          most_recent_movie: results.most_recent_movie,
        });
        console.log(this.state);
        this.getRecentWatch();
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
        console.log(results);
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
        console.log(results);
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
        console.log("upcoming error");
        console.log(err);
      });
  }

  searchChangeHandler(event) {
    console.log(event.target.value);
    const boundObject = this;
    const searchTerm = event.target.value;
    boundObject.performSearch(searchTerm);
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
          <Nav className="ml-auto nav-right nav-info">
            <Link to="/profile" className="navbar-active user-nav-wrapper ">
              <div className="nav-pic-wrapper">
                <img
                  className="nav-user-profile-pic"
                  src={this.state.user_profile.image}
                />
              </div>
            </Link>
          </Nav>
        </Navbar>
        <div className="landing-wrapper">
          <div className="landing-backdrop">
            <img
              src={
                "https://image.tmdb.org/t/p/original" +
                this.state.most_recent_movie.backdrop_path
              }
            />
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
                  {this.state.most_recent_movie.title}
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
