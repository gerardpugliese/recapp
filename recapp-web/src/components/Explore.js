import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import MovieRow from "./MovieRow";
class Explore extends Component {
  constructor(props) {
    super(props);
    this.loadMovies();
  }
  state = {
    upcoming: [],
    rows: [],
    isHovering: false,
  };

  loadMovies() {
    const nowplaying = [];
    const upcoming = [];

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
          const movieRow = (
            <MovieRow key={movie.id} movie={movie} info={"nowplaying"} />
          );
          nowplaying.push(movieRow);
          this.setState({
            rows: nowplaying,
          });
          //}
        });
      })
      .catch((err) => {
        console.log("upcoming error");
        console.log(err);
      });

    // Get movies that are almost in theaters
    const upcomingURLString =
      "https://api.themoviedb.org/3/movie/upcoming?api_key=c69a9bc66efca73bdac1c765494a3655&region=US&with_release_type=2|3";
    fetch(upcomingURLString, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.results;
        results.forEach((movie) => {
          movie.poster_src =
            "https://image.tmdb.org/t/p/original" + movie.poster_path;
          const movieRow = (
            <MovieRow key={movie.id} movie={movie} info={"upcoming"} />
          );
          upcoming.push(movieRow);
          this.setState({
            upcoming: upcoming,
          });
          // }
        });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.loadMovies();
  }

  render() {
    return (
      <div className="explore-wrapper">
        <Navbar className="title-bar">
          <Nav className="mr-auto">
            <Link to="/" className="explore-navbar-logo">
              <i className="fas fa-video  align-vertically explore-logo-icon"></i>
              <p className="explore-logo-text">RECAPP</p>
            </Link>
          </Nav>
          <Animated
            animationIn="slideInRight"
            animationInDuration={800}
            animationOut="fadeOut"
            isVisible={true}
            className="ml-auto"
          >
            <Nav className="nav-info">
              <Link
                to="/login"
                className="navbar-inactive non-user-nav-wrapper"
              >
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="navbar-inactive non-user-nav-wrapper"
              >
                REGISTER
              </Link>
              <Link to="/explore" className="navbar-active">
                EXPLORE
              </Link>
            </Nav>
          </Animated>
        </Navbar>
        <div className="nowplaying-wrapper">
          <div className="nowplaying-text-wrapper">
            <p className="nowplaying-text">IN THEATERS NOW</p>
          </div>
          <div className="movie-carousel">
            <div className="nowplaying-movie-wrapper">{this.state.rows}</div>
          </div>
        </div>
        <div className="explore-content-wrapper">
          <div className="upcoming-movies-wrapper">
            <div className="upcoming-text-wrapper">
              <p className="upcoming-text">COMING SOON</p>
            </div>
            <div className="upcoming-movie-view">{this.state.upcoming}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Explore;
