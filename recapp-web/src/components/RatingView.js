import React, { Component } from "react";
import Rating from "./Rating";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

class RatingView extends Component {
  state = {
    token: this.props.token,
    default_slider_value: 0,
    slider_value: this.props.user_rating,
    movie_name: this.props.movie_name,
    movie_year: this.props.movie_year,
    slider_color: "#333333",
    poster: this.props.poster_src,
    item_state: this.props.state,
    media_type: this.props.media_type,
    item_id: this.props.item_id,
    review_text: this.props.review,
  };

  markWatched() {
    console.log("in marked watched");
    const urlString = "http://127.0.0.1:8000/api/mark/mark_watched/";
    if (this.state.media_type === "movie") {
      fetch(urlString, {
        method: "POST",
        headers: {
          Authorization: `Token ${this.state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: this.state.item_id,
          rating: this.state.slider_value,
          review: this.state.review_text,
        }),
      })
        .then((resp) => {
          console.log(this.state);
          this.setState({
            item_state: 2,
          });
          this.props.hide_function(
            "submit_btn",
            this.state.slider_value,
            this.state.review_text
          );
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
        body: JSON.stringify({
          show_id: this.state.item_id,
          rating: this.state.slider_value,
          review: this.state.review_text,
        }),
      })
        .then((resp) => {
          console.log("here2");
          this.setState({
            item_state: 2,
          });
          this.props.hide_function(
            "submit_btn",
            this.state.slider_value,
            this.state.review_text
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  reflectSliderChanges(value) {
    console.log(value);
    let adjusted_value = value / 10;
    this.setState({ slider_value: value });
  }

  reflectReviewChanges(event) {
    console.log(event.target.value);
    this.setState({ review_text: event.target.value });
  }

  render() {
    return (
      <div className="rating-view-background">
        <div className="rating-view">
          <div className="rating-view-left-col">
            <img className="rating-view-poster" src={this.state.poster}></img>
          </div>
          <div className="rating-view-right-col">
            <div className="rating-view-row-1">
              <p
                className="rating-view-exit-btn"
                onClick={() => this.props.hide_function("close_btn", 0)}
              >
                X
              </p>
            </div>
            <div className="rating-view-row-2">
              <p className="rating-view-title">{this.state.movie_name}</p>
              {this.state.media_type === "movie" && (
                <p className="rating-view-year">
                  {"("}
                  {this.state.movie_year}
                  {")"}
                </p>
              )}
            </div>
            <div className="rating-view-row-3">
              <div className="slidecontainer">
                <InputRange
                  formatLabel={(value) => value / 10}
                  maxValue={100}
                  minValue={0}
                  value={this.state.slider_value}
                  onChange={(value) => this.reflectSliderChanges(value)}
                />
              </div>
            </div>

            <div className="rating-view-row-5">
              {console.log(this.state)}
              <textarea
                className="rating-view-textarea"
                value={this.state.review_text}
                onChange={this.reflectReviewChanges.bind(this)}
              ></textarea>
            </div>
            <div className="rating-view-row-6">
              <div
                className="rating-view-submit-btn"
                onClick={() => this.markWatched()}
              >
                <p className="rating-view-btn-text">Save</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatingView;
