import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withCookies } from "react-cookie";

class Login extends Component {
  constructor(props) {
    super(props);
    const numBackgrounds = 28;
    this.loadMovieImages(Math.floor(Math.random() * numBackgrounds) + 1);
  }

  state = {
    bkg_img_src: "",
    bkg_img_name: "",
    credentials: {
      username: "",
      password: "",
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

  inputChanged = (event) => {
    let cred = this.state.credentials;
    cred[event.target.name] = event.target.value;
    this.setState({ credentials: cred });
  };

  login = (event) => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.credentials),
    })
      .then((resp) => resp.json())
      .then((res) => {
        var keyNames = Object.keys(res);
        console.log(res);
        console.log(keyNames);
        if (keyNames[0] === "token") {
          this.props.cookies.set("recapp-token", res.token, {
            path: "/",
            maxAge: 31536000,
          });
          this.props.cookies.set(
            "recapp-username",
            this.state.credentials.username,
            { path: "/" }
          );
          window.location.href = "/landing";
        } else {
          let error = res[keyNames[0]][0];
          console.log(error);
          this.displayError(error);
        }
      })
      .catch((err) => {
        console.log(err);
        this.displayError(err);
      });
  };

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-content-wrapper">
          <Navbar className="title-bar">
            <Nav className="mr-auto">
              <Link to="/" className="explore-navbar-logo">
                <i className="fas fa-video  align-vertically explore-logo-icon"></i>
                <p className="explore-logo-text explore-logo-text">RECAPP</p>
              </Link>
            </Nav>

            <Nav>
              <Link to="/login" className="navbar-active">
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="navbar-inactive non-user-nav-wrapper"
              >
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
          <div className="l-wrapper">
            <div className="login-logo-wrapper">
              <i className="fas fa-video login-logo-icon align-vertically"></i>
              <p className="login-logo-text">RECAPP</p>
            </div>
            <div className="login-form-wrapper">
              {this.state.error_raised && (
                <div className="login-form-error-wrapper">
                  <p className="login-error-text">{this.state.error_text}</p>
                </div>
              )}
              <div className="login-form-label-wrapper">
                <span className="login-form-label"> Username</span>
              </div>
              <br />
              <input
                className="login-form-input"
                type="text"
                name="username"
                value={this.state.credentials.username}
                onChange={this.inputChanged}
              ></input>
              <br />
              <div className="login-form-label-wrapper">
                <span className="login-form-label"> Password</span>
              </div>
              <br />
              <input
                className="login-form-input"
                type="password"
                name="password"
                value={this.state.credentials.password}
                onChange={this.inputChanged}
              ></input>
              <br />
              <button className="login-form-button" onClick={this.login}>
                SIGN IN
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

export default withCookies(Login);
