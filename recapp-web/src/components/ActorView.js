import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import ShowRow from "./ShowRow";
import MovieRow from "./MovieRow";

class ActorView extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    token: this.props.cookies.get("recapp-token"),
    actor_id: this.props.cookies.get("actor-id"),
    user_profile: {
      username: "",
      image: "",
      def_image: "",
      highest_genre: "",
      highest_movie: "",
    },
    credits: [],
    actor_name: "",
    actor_birthday: "",
    actor_bio: "",
    actor_deathday: "",
    actor_birthplace: "",
    actor_img: "",
  };

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
        });
      })
      .catch((err) => console.log(err));
  }

  getActorInformation() {
    const actorInfoURL = `https://api.themoviedb.org/3/person/${this.state.actor_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    fetch(actorInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        this.setState({
          actor_name: res.name,
          actor_birthday: res.birthday,
          actor_deathday: res.deathday,
          actor_bio: res.biography,
          actor_birthplace: res.place_of_birth,
          actor_img: "https://image.tmdb.org/t/p/original" + res.profile_path,
        });
      })
      .catch((err) => console.log(err));
  }

  getActorCredits() {
    console.log(this.state.token);
    let credits_cap = 30;
    let i = 0;
    let credits = [];
    const actorInfoURL = `https://api.themoviedb.org/3/person/${this.state.actor_id}/combined_credits?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
    console.log(actorInfoURL);
    fetch(actorInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        const sortedResults = res.cast.sort(
          this.compareValues("popularity", "desc")
        );
        console.log(sortedResults);
        if (sortedResults.length < credits_cap) {
          credits_cap = sortedResults.length;
        }
        for (i = 0; i < credits_cap; i++) {
          if (sortedResults[i].media_type === "movie") {
            sortedResults[i].poster_src =
              "https://image.tmdb.org/t/p/original" +
              sortedResults[i].poster_path;
            const movie_credit = (
              <MovieRow
                id={sortedResults[i].id}
                movie={sortedResults[i]}
                info={"none"}
              />
            );
            credits.push(movie_credit);
          } else if (
            sortedResults[i].media_type === "tv" &&
            sortedResults[i].episode_count > 10
          ) {
            sortedResults[i].poster_src =
              "https://image.tmdb.org/t/p/original" +
              sortedResults[i].poster_path;
            if (sortedResults[i].character !== "") {
              const show_credit = (
                <ShowRow id={sortedResults[i].id} show={sortedResults[i]} />
              );
              credits.push(show_credit);
            }
          }
          if (i === credits_cap) break;
        }
        this.setState({ credits: credits });
      })
      .catch((err) => console.log(err));
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

  compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  sanitizeDate(date) {
    let split_date = date.split("-");
    return split_date[1] + "/" + split_date[2] + "/" + split_date[0];
  }

  componentDidMount() {
    this.getProfileInformation();
    this.getActorInformation();
    this.getActorCredits();
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
            <Nav>
              <Link to="/landing" className="explore-navbar-logo">
                <i className="fas fa-video  explore-logo-icon align-vertically"></i>

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
              <Link
                to="/shows"
                className="navbar-inactive non-user-nav-wrapper"
              >
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
        <div className="credits-results">
          <div className="credits-header">
            <div className="credits-header-img-wrapper">
              <img className="credits-header-img" src={this.state.actor_img} />
            </div>
            <div className="credits-info-wrapper">
              <p className="credits-info-name">{this.state.actor_name}</p>
              <p className="credits-info-birthday">
                Birthday: {this.sanitizeDate(this.state.actor_birthday)}
              </p>
              <p className="credits-info-birthplace">
                Birthplace: {this.state.actor_birthplace}
              </p>
              <p className="credits-info-bio-header">Biography:</p>
              <p className="credits-info-bio">{this.state.actor_bio}</p>
            </div>
          </div>
          <p className="credits-list-header">Movie/Show Credits</p>
          <div className="credits-list-wrapper">{this.state.credits}</div>
        </div>
      </div>
    );
  }
}

export default withCookies(ActorView);
