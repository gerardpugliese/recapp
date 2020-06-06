import React, { Component } from "react";
import { withCookies } from "react-cookie";

class Icons extends Component {
  state = {
    token: this.props.cookies.get("recapp-token"),
    item_id: this.props.item_id,
    item_state: this.props.state,
    is_favorite: this.props.is_favorite,
    media_type: this.props.media_type,
  };

  updateState(state) {
    this.setState({ item_state: state });
  }

  markInterested(id) {
    if (this.state.item_state === 1) {
      const urlString = `http://127.0.0.1:8000/api/mark/${this.state.item_id}/remove_state/`;
      fetch(urlString, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${this.state.token}`,
        },
      })
        .then((resp) => {
          this.setState({
            item_state: 0,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const urlString = "http://127.0.0.1:8000/api/mark/mark_interested/";
      if (this.state.media_type === "movie") {
        fetch(urlString, {
          method: "POST",
          headers: {
            Authorization: `Token ${this.state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_id: this.state.item_id }),
        })
          .then((resp) => {
            this.setState({
              item_state: 1,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.state.media_type === "tv") {
        fetch(urlString, {
          method: "POST",
          headers: {
            Authorization: `Token ${this.state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ show_id: this.state.item_id }),
        })
          .then((resp) => {
            this.setState({
              item_state: 1,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }
  handleWatched() {
    if (this.state.item_state === 2) {
      const urlString = `http://127.0.0.1:8000/api/mark/${this.state.item_id}/remove_state/`;
      fetch(urlString, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${this.state.token}`,
        },
      })
        .then((resp) => {
          this.setState({
            item_state: 0,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // This movie / show is not already marked as watched, so open Rating View
      // Open it by setting display style of it to visible
      // The component where RatingView exists is in MovieView/ShowView
      // Need a callback function passed in as a prop to trigger the change.
      this.props.callback_function();
    }
  }
  markFavorite() {
    if (this.state.is_favorite === true) {
      const urlString = `http://127.0.0.1:8000/api/mark/${this.state.item_id}/remove_favorite/`;
      fetch(urlString, {
        method: "GET",
        headers: {
          Authorization: `Token ${this.state.token}`,
        },
      })
        .then((resp) => {
          this.setState({
            item_state: 2,
            is_favorite: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const urlString = `http://127.0.0.1:8000/api/mark/True/favorite_movie/`;
      if (this.state.media_type === "movie") {
        fetch(urlString, {
          method: "POST",
          headers: {
            Authorization: `Token ${this.state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_id: this.state.item_id }),
        })
          .then((resp) => {
            this.setState({
              item_state: 2,
              is_favorite: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.state.media_type === "tv") {
        fetch(urlString, {
          method: "POST",
          headers: {
            Authorization: `Token ${this.state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ show_id: this.state.item_id }),
        })
          .then((resp) => {
            this.setState({
              item_state: 2,
              is_favorite: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="interested-icon-wrapper">
          {this.state.item_state === 1 ? (
            <i
              className="fas fa-eye interested-icon orange"
              onClick={() => this.markInterested(this.props.item_id)}
            ></i>
          ) : (
            <i
              className="fas fa-eye interested-icon"
              onClick={() => this.markInterested(this.props.item_id)}
            ></i>
          )}
        </div>

        <div className="watched-icon-wrapper">
          {this.state.item_state === 2 ? (
            <i
              className="fas fa-check watched-icon light-green"
              onClick={() => this.handleWatched(this.props.item_id)}
            ></i>
          ) : (
            <i
              className="fas fa-check watched-icon"
              onClick={() => this.handleWatched(this.props.item_id)}
            ></i>
          )}
        </div>
        <div className="favorite-icon-wrapper">
          {this.state.is_favorite === true ? (
            <i
              className="fas fa-star favorite-icon yellow"
              onClick={() => this.markFavorite(this.props.item_id)}
            ></i>
          ) : (
            <i
              className="fas fa-star favorite-icon"
              onClick={() => this.markFavorite(this.props.item_id)}
            ></i>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withCookies(Icons);
