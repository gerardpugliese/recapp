import React, { Component } from "react";
import TopTenResult from "./TopTenResult";

let top_ten = [];
class TopTen extends Component {
  constructor(props) {
    super(props);
    top_ten = this.props.top_ten;
  }

  state = {
    token: this.props.token,
    results: [],
    nondefault_results: [],
    show_edit_window: false,
    edit_item: {
      name: "",
      img: "",
      number: "",
      id: "",
    },
    search_results: [],
    show_confirm_edit: false,
    show_topten_movies: true,
    show_topten_shows: false,
  };

  setTopTen(name, img, number, id) {
    let media_type = this.displayInfo();

    top_ten[number - 1] = {
      item_id: id,
      media: media_type,
      number: number,
      img_link: img,
      title: name,
    };

    this.props.set_callback(name, img, number, id, media_type);
    this.setState({
      show_confirm_edit: false,
      show_edit_window: false,
      edit_item: {
        name: "",
        img: "",
        number: "",
      },
    });
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
          let img_link =
            "https://image.tmdb.org/t/p/original" + result.poster_path;
          let name = "";
          if (result.title === undefined) {
            name = result.name;
          } else {
            name = result.title;
          }
          const resultItem = (
            <TopTenResult
              name={name}
              img={img_link}
              number={this.state.edit_item.number}
              id={result.id}
              callback_function={this.showConfirmEdit.bind(this)}
            />
          );
          search_results.push(resultItem);
          this.setState({
            search_results: search_results,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showEditWindow(name, img, number) {
    this.setState({
      show_edit_window: true,
      edit_item: {
        name: name,
        img: img,
        number: number,
      },
    });
  }

  backEditWindow() {
    this.setState({
      show_edit_window: false,
      edit_item: {
        name: "",
        img: "",
        number: "",
      },
    });
  }

  showConfirmEdit(name, img, number, id) {
    this.setState({
      show_confirm_edit: true,
      edit_item: {
        name: name,
        img: img,
        number: number,
        id: id,
      },
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

  displayInfo() {
    return this.props.info === "Movies" ? "Movie" : "Show";
  }

  render() {
    return (
      <div className="top-ten-background">
        <div className="top-ten">
          <div className="top-ten-btn-row">
            {this.state.show_edit_window === true && (
              <p
                className="top-ten-back-btn"
                onClick={() => this.backEditWindow()}
              >
                <i class="fas fa-arrow-left"></i>
              </p>
            )}
            <p
              className="top-ten-close-btn"
              onClick={() => this.props.hide_function()}
            >
              <i class="fas fa-times"></i>
            </p>
          </div>
          <div style={{ height: "fit-content", display: "flex" }}>
            <p className="top-ten-title">Your Top Ten {this.props.info}</p>
          </div>
          {this.state.show_edit_window ? (
            <div className="edit-window">
              <div className="edit-window-left-col">
                <p className="edit-window-title">
                  {this.state.edit_item.number} {"."}{" "}
                  {this.state.edit_item.name}
                </p>
                {this.state.edit_item.img === "" ? (
                  <div className="default-edit-topten-img"> </div>
                ) : (
                  <img
                    alt="edit-item"
                    className="edit-window-img"
                    src={this.state.edit_item.img}
                  />
                )}
              </div>
              <div className="edit-window-right-col">
                {this.state.show_confirm_edit ? (
                  <div className="confirm-wrapper">
                    <p className="confirm-edit-text">
                      Make {this.state.edit_item.name} your #
                      {this.state.edit_item.number} {this.displayInfo()}?
                    </p>
                    <div
                      className="edit-window-btn"
                      onClick={() =>
                        this.setTopTen(
                          this.state.edit_item.name,
                          this.state.edit_item.img,
                          this.state.edit_item.number,
                          this.state.edit_item.id
                        )
                      }
                    >
                      <p className="edit-window-btn-text">Confirm Change</p>
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="topten-search-bar-wrapper">
                      <i className="fas fa-search"></i>
                      <input
                        className="search-bar"
                        placeholder="Search..."
                        onChange={this.searchChangeHandler.bind(this)}
                      ></input>
                    </div>
                    <div className="topten-search-results">
                      {this.state.search_results}
                    </div>{" "}
                  </React.Fragment>
                )}
              </div>
            </div>
          ) : (
            <div className="top-ten-results-wrapper">
              {top_ten.map((movie, index) => {
                return movie === "" ? (
                  <div
                    className="top-ten-default-wrapper"
                    onClick={() => {
                      this.showEditWindow("", "", index + 1);
                    }}
                  >
                    <div className="top-ten-default">
                      <p className="top-ten-default-text">Click to edit.</p>
                    </div>
                    <p className="top-ten-text">
                      {index + 1} {"."}
                    </p>
                  </div>
                ) : (
                  <div
                    className="top-ten-nondefault"
                    onClick={() => {
                      this.showEditWindow(
                        movie.title,
                        movie.img_link,
                        movie.number
                      );
                    }}
                  >
                    <img
                      alt="top-ten"
                      className="top-ten-img"
                      src={movie.img_link}
                    ></img>
                    <p className="top-ten-text">
                      {movie.number} {". "} {movie.title}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TopTen;
