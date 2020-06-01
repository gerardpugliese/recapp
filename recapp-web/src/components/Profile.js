import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import MovieRow from "./MovieRow";
import ShowRow from "./ShowRow";
import TopTen from "./TopTen";
import Filter from "./Filter";
import { Animated } from "react-animated-css";

let list_to_filter_new = [];
let list_of_filters_new = [];
let top_ten_movies = ["", "", "", "", "", "", "", "", "", ""];
let top_ten_shows = ["", "", "", "", "", "", "", "", "", ""];
let favorite_movie_backdrop = "";
let favorite_show_backdrop = "";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.getTopTen();
    this.getFavoriteMovies();
    this.getWatchedMovies();
    this.getInterestedMovies();
  }
  state = {
    token: this.props.cookies.get("recapp-token"),
    interested: [],
    watched: [],
    user_profile: {
      username: "",
      image: "",
      def_image: "",
      def_profile_img: "",
      movies_watched: "",
      shows_watched: "",
    },
    most_recent_movie: "",
    view_favorites: true,
    view_watched: false,
    view_interested: false,
    interested: [],
    watched: [],
    favorites: [],
    favorites_backdrops: [],
    movies_gotten: false,
    applied_filters: [],
    filtered_list: [],
    view_filtered: false,
    search_results: [],
    filters: [],
    filters_to_apply: [],
    show_top_ten: false,
  };

  setTopTen(name, img, number, id, media_type) {
    console.log("media_type");
    console.log(media_type);
    const urlString = "http://127.0.0.1:8000/api/topten/set_top_ten/";
    fetch(urlString, {
      method: "POST",
      headers: {
        Authorization: `Token ${this.state.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_id: id,
        media: media_type,
        number: number,
        img_link: img,
        title: name,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        this.setState({});
      })
      .catch((err) => console.log(err));
  }

  getTopTen() {
    //Make GET request to database
    let noOneMovieID = "";
    let noOneShowID = "";
    const urlString = "http://127.0.0.1:8000/api/topten/get_top_ten/";
    fetch(urlString, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res.TopTens);
        let toptens = res.TopTens;
        /*toptens.forEach((item) => {
          const toptenrow = (
            <TopTenRow
              name={item.title}
              img={item.img_link}
              number={item.number}
            />
          );
          console.log(item);
          if (item.media_type === "movie") {
            top_ten_movies[item.number - 1] = toptenrow;
          } else {
            top_ten_shows[item.number - 1] = toptenrow;
          }
        });*/
        toptens.forEach((movie, index) => {
          if (movie.media_type === "Movie") {
            if (movie.number - 1 === 0) {
              noOneMovieID = movie.item_id;
            }
            top_ten_movies[movie.number - 1] = movie;
          } else {
            if (movie.number - 1 === 0) {
              noOneShowID = movie.item_id;
            }
            top_ten_shows[movie.number - 1] = movie;
          }
        });
        this.getTopFavorites(noOneMovieID, noOneShowID);
      })
      .catch((err) => console.log(err));
    //fill in blanks in top_ten_movies & top_ten_rows with default topTenRows
    this.getTopFavorites();
  }

  getTopFavorites(favorite_movie_id, favorite_show_id) {
    console.log(favorite_movie_id);
    console.log(favorite_show_id);
    let favorite_movie_title = "";
    let favorite_show_title = "";
    const movieInfoURL = `https://api.themoviedb.org/3/movie/${favorite_movie_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    console.log(movieInfoURL);
    fetch(movieInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        favorite_movie_backdrop =
          "https://image.tmdb.org/t/p/original" + res.backdrop_path;
        favorite_movie_title = res.title;
      })
      .catch((err) => console.log(err));

    const showInfoURL = `https://api.themoviedb.org/3/tv/${favorite_show_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US&include_image_language=en,null`;
    console.log(showInfoURL);
    fetch(showInfoURL, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        favorite_show_backdrop =
          "https://image.tmdb.org/t/p/original" + res.backdrop_path;
        favorite_show_title = res.name;
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
        var interestedResults = [];

        results.forEach((item) => {
          if (item.media_type === "movie") {
            const movieInfoURL = `https://api.themoviedb.org/3/movie/${item.item_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
            fetch(movieInfoURL, {
              method: "GET",
            })
              .then((resp) => resp.json())
              .then((res) => {
                const results = res;

                results.poster_src =
                  "https://image.tmdb.org/t/p/original" + results.poster_path;
                const movieRow = (
                  <MovieRow key={results.id} movie={results} info={"none"} />
                );
                interestedResults.unshift(movieRow);
              })
              .catch((err) => console.log(err));
          } else if (item.media_type === "tv") {
            const showInfoURL = `https://api.themoviedb.org/3/tv/${item.item_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
            fetch(showInfoURL, {
              method: "GET",
            })
              .then((resp) => resp.json())
              .then((res) => {
                const results = res;

                results.poster_src =
                  "https://image.tmdb.org/t/p/original" + results.poster_path;
                const showRow = (
                  <ShowRow key={results.id} show={results} info={"none"} />
                );
                interestedResults.unshift(showRow);
              })
              .catch((err) => console.log(err));
          }
        });
        this.setState({ interested: interestedResults });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFavoriteMovies() {
    const urlString = "http://127.0.0.1:8000/api/mark/get_favorites_list/";
    fetch(urlString, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        const results = res.favorites_list;
        var favoriteResults = [];
        var favoriteBackdrops = [];

        results.forEach((item) => {
          if (item.media_type === "movie") {
            const movieInfoURL = `https://api.themoviedb.org/3/movie/${item.item_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
            fetch(movieInfoURL, {
              method: "GET",
            })
              .then((resp) => resp.json())
              .then((res) => {
                const results = res;

                results.poster_src =
                  "https://image.tmdb.org/t/p/original" + results.poster_path;

                favoriteBackdrops.push(
                  "https://image.tmdb.org/t/p/original" + results.backdrop_path
                );

                const movieRow = (
                  <MovieRow key={results.id} movie={results} info={"none"} />
                );
                favoriteResults.unshift(movieRow);
              })
              .catch((err) => console.log(err));
          } else if (item.media_type === "tv") {
            const showInfoURL = `https://api.themoviedb.org/3/tv/${item.item_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
            fetch(showInfoURL, {
              method: "GET",
            })
              .then((resp) => resp.json())
              .then((res) => {
                const results = res;

                results.poster_src =
                  "https://image.tmdb.org/t/p/original" + results.poster_path;

                favoriteBackdrops.push(
                  "https://image.tmdb.org/t/p/original" + results.backdrop_path
                );
                const showRow = (
                  <ShowRow key={results.id} show={results} info={"none"} />
                );
                favoriteResults.unshift(showRow);
              })
              .catch((err) => console.log(err));
          }
        });
        this.setState({
          favorites: favoriteResults,
          favorites_backdrops: favoriteBackdrops,
        });
        this.getProfileInformation();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getWatchedMovies() {
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
        var watchedResults = [];
        results.forEach((item) => {
          if (item.media_type === "movie") {
            const movieInfoURL = `https://api.themoviedb.org/3/movie/${item.item_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
            fetch(movieInfoURL, {
              method: "GET",
            })
              .then((resp) => resp.json())
              .then((res) => {
                const results = res;

                results.poster_src =
                  "https://image.tmdb.org/t/p/original" + results.poster_path;
                const movieRow = (
                  <MovieRow key={results.id} movie={results} info={"none"} />
                );
                watchedResults.unshift(movieRow);
              })
              .catch((err) => console.log(err));
          } else if (item.media_type === "tv") {
            const showInfoURL = `https://api.themoviedb.org/3/tv/${item.item_id}?api_key=c69a9bc66efca73bdac1c765494a3655&language=en-US`;
            fetch(showInfoURL, {
              method: "GET",
            })
              .then((resp) => resp.json())
              .then((res) => {
                const results = res;

                results.poster_src =
                  "https://image.tmdb.org/t/p/original" + results.poster_path;
                const showRow = (
                  <ShowRow key={results.id} show={results} info={"none"} />
                );
                watchedResults.unshift(showRow);
              })
              .catch((err) => console.log(err));
          }
        });
        this.setState({ watched: watchedResults, movies_gotten: true });
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
        console.log(results);
        this.setState({
          user_profile: {
            username: this.props.cookies.get("recapp-username"),
            image: "http://127.0.0.1:8000" + results.image,
            def_image: "http://127.0.0.1:8000" + results.def_image,
            def_profile_img:
              "http://127.0.0.1:8000" + results.def_profile_image,
            movies_watched: results.movies_watched,
            shows_watched: results.shows_watched,
            highest_rated_movie: results.highest_rated_movie,
            highest_rated_show: results.highest_rated_show,
          },
          most_recent_movie: results.most_recent_movie,
        });
      })
      .catch((err) => console.log(err));
  }

  decide_unfiltered_list() {
    if (this.state.view_favorites) {
      return this.state.favorites;
    } else if (this.state.view_interested) {
      return this.state.interested;
    } else if (this.state.view_watched) {
      return this.state.watched;
    }
  }

  applyFilter(filter = "") {
    let filter_type = "";
    let list_to_filter = [];

    if (filter !== "") {
      list_of_filters_new.push(filter);
    }

    console.log(list_of_filters_new);

    list_to_filter_new = this.decide_unfiltered_list();

    //Step into appropriate case based off of filter type, and then apply filter
    console.log(list_to_filter);

    list_of_filters_new.map((filter) => {
      let new_list = [];
      filter_type = this.decideFilterType(filter);
      switch (filter_type) {
        case "genre":
          //Loop through each item in things we want to filter
          list_to_filter_new.map((obj) => {
            const genres = obj.props[Object.keys(obj.props)[0]].genres;
            //Loop through filter names
            var i = 0;
            while (i < genres.length) {
              //If this item has the filter and is not already in our filtered list, add it
              if (genres[i].name === filter) {
                new_list.push(obj);
                break;
              }
              i++;
            }
          });
          break;
        case "media":
          list_to_filter_new.map((obj) => {
            if (filter === "TV-Show") {
              if (obj.props[Object.keys(obj.props)[0]].seasons !== undefined) {
                new_list.push(obj);
              }
            } else if (filter === "Movie") {
              if (obj.props[Object.keys(obj.props)[0]].seasons === undefined) {
                new_list.push(obj);
              }
            }
          });
          break;
      }
      list_to_filter_new = new_list;
      console.log(list_to_filter_new);
      console.log(list_of_filters_new);
      this.setState({
        view_filtered: true,
      });
    });
  }

  decideFilterType(filter) {
    const mediaFilters = ["TV-Show", "Movie"];
    console.log(mediaFilters.includes(filter));
    return mediaFilters.includes(filter) ? "media" : "genre";
  }

  decideListToFilter() {
    let list_to_return = [];
    if (this.state.applied_filters.length > 0) {
      list_to_return = this.state.filtered_list;
    } else {
      list_to_return = this.state.decide_unfiltered_list();
    }
    return list_to_return;
  }

  reset_filter(filter) {
    list_of_filters_new = list_of_filters_new.filter((e) => e !== filter);
    console.log(list_of_filters_new);
    if (list_of_filters_new.length === 0) {
      this.setState({ view_filtered: false });
    } else {
      console.log("in else of reset filter");
      this.applyFilter();
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

  showTopTen(type) {
    this.setState({ show_top_ten: true, top_ten_type: type });
  }

  hideTopTen() {
    this.setState({ show_top_ten: false });
  }

  updateTopTen(top_ten, type) {
    if (type == "Movies") {
      this.setState({ top_ten_movies: top_ten });
      const urlString =
        "http://127.0.0.1:8000/api/userprofile/set_top_ten_movies/";
      fetch(urlString, {
        method: "POST",
        headers: {
          Authorization: `Token ${this.state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          top_ten: top_ten,
        }),
      })
        .then((resp) => resp.json())
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else {
      //this.setState({ top_ten_shows: top_ten })
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="profile-wrapper">
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
            <Animated
              animationIn="slideInRight"
              animationInDuration={800}
              animationOut="fadeOut"
              isVisible={true}
              className="ml-auto nav-right"
            >
              <Nav className="nav-info">
                <Link to="/profile" className="navbar-active user-nav-wrapper ">
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
          <div className="profile-bkg-img">
            <img src={this.state.user_profile.def_profile_img} />
          </div>
          <div className="profile-bkg-overlay"></div>
          <div className="profile-content-wrapper">
            <div className="profile-row-1">
              <div className="profile-image-wrapper">
                <div className="image-name-wrapper">
                  <img
                    className="profile-image"
                    src={this.state.user_profile.image}
                  />
                  <p className="profile-username">
                    {this.state.user_profile.username}
                  </p>
                  <div className="top-ten-bkg">
                    <p
                      className="top-ten-text"
                      onClick={() => {
                        this.showTopTen("Movies");
                      }}
                    >
                      Your Top 10 Movies
                    </p>
                  </div>
                  <div className="top-ten-bkg">
                    <p
                      className="top-ten-text"
                      onClick={() => {
                        this.showTopTen("Shows");
                      }}
                    >
                      Your Top 10 Shows
                    </p>
                  </div>
                </div>
              </div>
              <div className="profile-stats">
                <div>
                  <p className="stats-header">Your Favorite Movie</p>
                  {console.log(favorite_movie_backdrop)}
                  {favorite_movie_backdrop !== "undefined" && (
                    <img
                      className="stats-img"
                      src={favorite_movie_backdrop}
                    ></img>
                  )}
                </div>
              </div>
              <div className="profile-stats">
                <p className="stats-header">Your Favorite Show</p>
                {console.log(favorite_show_backdrop)}
                {favorite_show_backdrop !== "undefined" && (
                  <img className="stats-img" src={favorite_show_backdrop}></img>
                )}
              </div>
            </div>
            <div className="profile-row-2">
              <div className="profile-lists-nav">
                {this.state.view_favorites ? (
                  <div
                    className="profile-nav-favorites-active"
                    onClick={() =>
                      this.setState({
                        view_favorites: true,
                        view_interested: false,
                        view_watched: false,
                      })
                    }
                  >
                    <p className="profile-nav-text">Favorites</p>
                  </div>
                ) : (
                  <div
                    className="profile-nav-favorites"
                    onClick={() =>
                      this.setState({
                        view_favorites: true,
                        view_interested: false,
                        view_watched: false,
                        view_filtered: false,
                      })
                    }
                  >
                    <p className="profile-nav-text">Favorites</p>
                  </div>
                )}

                {this.state.view_interested ? (
                  <div
                    className="profile-nav-interests-active"
                    onClick={() =>
                      this.setState({
                        view_favorites: false,
                        view_interested: true,
                        view_watched: false,
                        view_filtered: false,
                      })
                    }
                  >
                    <p className="profile-nav-text">Interested</p>
                  </div>
                ) : (
                  <div
                    className="profile-nav-interests"
                    onClick={() =>
                      this.setState({
                        view_favorites: false,
                        view_interested: true,
                        view_watched: false,
                        view_filtered: false,
                      })
                    }
                  >
                    <p className="profile-nav-text">Interested</p>
                  </div>
                )}

                {this.state.view_watched ? (
                  <div
                    className="profile-nav-watched-active"
                    onClick={() =>
                      this.setState({
                        view_favorites: false,
                        view_interested: false,
                        view_watched: true,
                        view_filtered: false,
                      })
                    }
                  >
                    <p className="profile-nav-text">Watched</p>
                  </div>
                ) : (
                  <div
                    className="profile-nav-watched"
                    onClick={() =>
                      this.setState({
                        view_favorites: false,
                        view_interested: false,
                        view_watched: true,
                        view_filtered: false,
                      })
                    }
                  >
                    <p className="profile-nav-text">Watched</p>
                  </div>
                )}
              </div>

              <div className="filter-wrapper">
                <p className="filter-header">Filter by:</p>
                <div className="filter-dropdown-wrapper">
                  <div className="fmdh-wrapper">
                    <p className="filter-dropdown-header">Media</p>
                  </div>
                  <div className="media-filter-results">
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Movie"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="media"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="TV-Show"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="media"
                      />
                    </div>
                  </div>
                </div>
                <div className="filter-dropdown-wrapper">
                  <div className="fmdh-wrapper">
                    <p className="filter-dropdown-header">Genre</p>
                  </div>
                  <div className="media-filter-results">
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Action"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Adventure"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Animation"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Comedy"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Crime"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Documentary"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Drama"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Family"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Fantasy"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="History"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Horror"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Music"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Mystery"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Romance"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Science Fiction"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Thriller"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="TV Movie"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="War"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                    <div className="media-results-wrapper">
                      <Filter
                        filter_name="Western"
                        callback_function={this.applyFilter.bind(this)}
                        filter_type="genre"
                      />
                    </div>
                  </div>
                </div>
                {this.state.view_filtered && (
                  <React.Fragment>
                    {list_of_filters_new.map((filter) => {
                      return (
                        <div className="applied-filter-wrapper">
                          <p className="applied-filter-text">{filter}</p>
                          <p
                            className="applied-filter-delete"
                            onClick={() => this.reset_filter(filter)}
                          >
                            X
                          </p>
                        </div>
                      );
                    })}
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="profile-lists-wrapper">
              <div className="profile-lists-results">
                {this.state.view_favorites && (
                  <div className="profile-favorites">
                    {this.state.view_filtered
                      ? list_to_filter_new
                      : this.state.favorites}
                  </div>
                )}
                {this.state.view_interested && (
                  <div className="profile-interests">
                    {this.state.view_filtered
                      ? list_to_filter_new
                      : this.state.interested}
                  </div>
                )}
                {this.state.view_watched && (
                  <div className="profile-watched">
                    {this.state.view_filtered
                      ? list_to_filter_new
                      : this.state.watched}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.state.show_top_ten === true && (
          <TopTen
            hide_function={this.hideTopTen.bind(this)}
            token={this.state.token}
            top_ten={
              this.state.top_ten_type === "Movies"
                ? top_ten_movies
                : top_ten_shows
            }
            info={this.state.top_ten_type}
            set_callback={this.setTopTen.bind(this)}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withCookies(Profile);
