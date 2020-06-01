import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Animated } from "react-animated-css";

class App extends Component {
  constructor(props) {
    super(props);
    this.loadMovieImages();
  }

  state = {
    bkg_img_src: "",
    bkg_img_name: "",
  };

  loadMovieImages() {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/moviebackground/get_movie_background/`,
      {
        method: "GET",
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        let random_index = Math.floor(Math.random() * res.movie_bkgs.length);
        console.log(random_index);
        const movie_id = res.movie_bkgs[random_index].movie_id;
        const bkg_name = res.movie_bkgs[random_index].movie_name;
        console.log(movie_id);
        const movieInfoURL = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
        fetch(movieInfoURL, {
          method: "GET",
        })
          .then((result) => result.json())
          .then((resp) => {
            console.log(resp);
            let bkg_img =
              "https://image.tmdb.org/t/p/original" + resp.backdrop_path;
            this.setState({ bkg_img_src: bkg_img, bkg_img_name: bkg_name });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  searchChangeHandler(event) {
    console.log(event.target.value);
    const searchTerm = event.target.value;
    this.performSearch(searchTerm);
  }

  render() {
    return (
      <div className="App">
        <div className="navbar-wrapper">
          <Navbar className="title-bar">
            <Nav className="mr-auto">
              <Link to="/" className="explore-navbar-logo">
                <i className="fas fa-video  align-vertically explore-logo-icon"></i>
                <p className="explore-logo-text explore-logo-text">RECAPP</p>
              </Link>
            </Nav>
            <Animated
              animationIn="slideInRight"
              animationInDuration={600}
              animationOut="fadeOut"
              isVisible={true}
              className="ml-auto"
            >
              <Nav>
                <Link to="/login" className="navbar-inactive">
                  SIGN IN
                </Link>
                <Link to="/register" className="navbar-inactive">
                  REGISTER
                </Link>
                <Link to="/explore" className="navbar-inactive">
                  EXPLORE
                </Link>
              </Nav>
            </Animated>
          </Navbar>
        </div>
        <div className="wrapper">
          <div className="welcome-content">
            <div className="logo-wrapper">
              <i className="fas fa-video logo-icon align-vertically"></i>
              <p className="logo-text">RECAPP</p>
            </div>
            <p className="welcome-text">Keep track of movies you've watched.</p>
            <p className="welcome-text">Create a watch list.</p>
            <p className="welcome-text-last">Get new recommendations daily.</p>
            <Link to="/register" className="welcome-button">
              GET STARTED
            </Link>
          </div>
        </div>
        <div className="opaque-overlay"></div>
        <div className="welcome-bkg-img">
          <img
            alt="poster"
            src={this.state.bkg_img_src}
            className="movie-img"
          ></img>
        </div>
        <div className="bkg-info-wrapper">
          <p className="bkg-info-text">{this.state.bkg_img_name}</p>
        </div>
      </div>
    );
  }
}

export default App;
