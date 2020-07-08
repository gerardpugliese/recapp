import React, { Component } from "react";

class Rating extends Component {
  render() {
    let rating = this.props.rating;
    if (this.props.type === "tomatoes") {
      let sanitized_rating = "";
      this.props.rating.length === 3
        ? (sanitized_rating = sanitized_rating.concat(
            this.props.rating[0],
            this.props.rating[1]
          ))
        : (sanitized_rating = this.props.rating[0]);

      rating = sanitized_rating / 10;
    }
    return rating <= 4.0 ? (
      this.props.type === "tomatoes" ? (
        <div className="rating red">{rating * 10}%</div>
      ) : (
        <div className="rating red">{rating}</div>
      )
    ) : rating <= 6.9 ? (
      this.props.type === "tomatoes" ? (
        <div className="rating yellow">{rating * 10}%</div>
      ) : (
        <div className="rating yellow">{rating}</div>
      )
    ) : rating <= 7.9 ? (
      this.props.type === "tomatoes" ? (
        <div className="rating light-green">{rating * 10}%</div>
      ) : (
        <div className="rating light-green">{rating}</div>
      )
    ) : this.props.type === "tomatoes" ? (
      <div className="rating green">{rating * 10}%</div>
    ) : (
      <div className="rating green">{rating}</div>
    );
  }
}

export default Rating;
