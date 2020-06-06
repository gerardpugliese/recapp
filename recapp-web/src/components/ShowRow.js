import React, { Component } from "react";
import { withCookies } from "react-cookie";

class ShowRow extends Component {
  state = {
    token: this.props.cookies.get("recapp-token"),
  };

  openShowView() {
    this.props.cookies.set("show-id", this.props.show.id);
    window.location.href = "/show";
  }

  render() {
    return (
      <div className="showRow-wrapper">
        <div className="showRow">
          {this.props.show.poster_src ===
          "https://image.tmdb.org/t/p/originalnull" ? (
            <div
              className="default-movie-row"
              onClick={() => this.openShowView()}
            >
              <div className="default-info-wrapper">
                <p className="default-movie-row-name">{this.props.show.name}</p>
              </div>
            </div>
          ) : (
            <img
              alt="show poster"
              src={this.props.show.poster_src}
              className="nowplaying-img"
              onClick={() => this.openShowView()}
            ></img>
          )}
        </div>
      </div>
    );
  }
}

export default withCookies(ShowRow);
