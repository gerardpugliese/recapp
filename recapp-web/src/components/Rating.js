import React, { Component } from "react";

class Rating extends Component {
  render() {
    let rating = this.props.rating;
    return rating <= 4.0 ? (
      <div className="rating red">{this.props.rating}</div>
    ) : rating <= 6.9 ? (
      <div className="rating yellow">{this.props.rating}</div>
    ) : rating <= 7.9 ? (
      <div className="rating light-green">{this.props.rating}</div>
    ) : (
      <div className="rating green">{this.props.rating}</div>
    );
  }
}

export default Rating;
