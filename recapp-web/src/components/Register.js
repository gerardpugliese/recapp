import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    const numBackgrounds = 28;
    const randomID = Math.floor(Math.random() * numBackgrounds) + 1;
    this.loadMovieImages(randomID);
  }
  state = {
    bkg_img_src: "",
    bkg_img_name: "",
    credentials: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    error_raised: false,
    error_text: "",
  };

  displayError = (error) => {
    this.setState({
      error_raised: true,
      error_text: error,
    });

    // Wait 5 seconds then reset
    setTimeout(() => {
      this.setState({
        error_raised: false,
        error_text: "",
      });
    }, 5000);
  };

  loadMovieImages() {
    //const movieInfoURL = `https://api.themoviedb.org/3/movie/${}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    fetch(
      `${process.env.REACT_APP_API_URL}/api/moviebackground/get_movie_background/`,
      {
        method: "GET",
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        let random_index = Math.floor(Math.random() * res.movie_bkgs.length);
        const movie_id = res.movie_bkgs[random_index].movie_id;
        const bkg_name = res.movie_bkgs[random_index].movie_name;
        const movieInfoURL = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
        fetch(movieInfoURL, {
          method: "GET",
        })
          .then((result) => result.json())
          .then((resp) => {
            let bkg_img =
              "https://image.tmdb.org/t/p/original" + resp.backdrop_path;
            this.setState({ bkg_img_src: bkg_img, bkg_img_name: bkg_name });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  inputChanged = (event) => {
    let cred = this.state.credentials;
    cred[event.target.name] = event.target.value;
    this.setState({ credentials: cred });
  };

  register = (event) => {
    if (
      this.state.credentials.password === this.state.credentials.confirmPassword
    ) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state.credentials),
      })
        .then((resp) => resp.json())
        .then((res) => {
          window.location.href = "/login";
        })
        .catch((err) => console.log(err));
    } else {
      this.displayError("Error: Passwords do not match.");
    }
  };

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-content-wrapper">
          <Navbar className="title-bar">
            <Nav className="mr-auto">
              <Link to="/" className="explore-navbar-logo">
                <i className="fas fa-video  align-vertically explore-logo-icon"></i>
                <p className="explore-logo-text">RECAPP</p>
              </Link>
            </Nav>

            <Nav className="ml-auto">
              <Link
                to="/login"
                className="navbar-inactive non-user-nav-wrapper"
              >
                SIGN IN
              </Link>
              <Link to="/register" className="navbar-active">
                REGISTER
              </Link>
              <Link
                to="/explore"
                className="navbar-inactive non-user-nav-wrapper"
              >
                EXPLORE
              </Link>
            </Nav>
          </Navbar>
          <div className="le-wrapper">
            <div className="register-logo-wrapper">
              <i className="fas fa-video register-logo-icon align-vertically"></i>
              <p className="register-logo-text">RECAPP</p>
            </div>
            <div className="register-form-wrapper">
              {this.state.error_raised && (
                <div className="register-form-error-wrapper">
                  <p className="error-text">{this.state.error_text}</p>
                </div>
              )}
              <div className="register-form-label-wrapper">
                <span className="register-form-label"> Username</span>
              </div>
              <br />
              <input
                className="register-form-input"
                type="text"
                name="username"
                value={this.state.credentials.username}
                onChange={this.inputChanged}
              ></input>
              <br />
              <div className="register-form-label-wrapper">
                <span className="register-form-label"> Email</span>
              </div>
              <br />
              <input
                className="register-form-input"
                type="email"
                name="email"
                value={this.state.credentials.email}
                onChange={this.inputChanged}
              ></input>
              <br />
              <div className="register-form-label-wrapper">
                <span className="register-form-label"> Password</span>
              </div>
              <br />
              <input
                className="register-form-input"
                type="password"
                name="password"
                value={this.state.credentials.password}
                onChange={this.inputChanged}
              ></input>
              <br />
              <div className="register-form-label-wrapper">
                <span className="register-form-label"> Confirm Password</span>
              </div>
              <br />
              <input
                className="register-form-input"
                type="password"
                name="confirmPassword"
                value={this.state.credentials.confirmPassword}
                onChange={this.inputChanged}
              ></input>
              <br />
              <button className="register-form-button" onClick={this.register}>
                SIGN UP
              </button>
            </div>
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

export default Register;
