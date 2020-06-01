import React, { Component } from "react";
import { withCookies } from "react-cookie";

class MovieRow extends Component {
  state = {
    token: this.props.cookies.get("recapp-token"),
  };

  openMovieView() {
    console.log("Open movie view for " + this.props.movie.id);
    this.props.cookies.set("movie-id", this.props.movie.id);
    window.location.href = "/movie";
  }

  sanitizeReleaseDate(date) {
    const results = date.split("-");
    return results[0];
  }

  render() {
    return (
      <div className="movieRow-wrapper">
        <div className="movieRow">
          {this.props.movie.poster_src ===
          "https://image.tmdb.org/t/p/originalnull" ? (
            <div
              className="default-movie-row"
              onClick={() => this.openMovieView()}
            >
              <div className="default-info-wrapper">
                <p className="default-movie-row-name">
                  {this.props.movie.title}
                </p>
                {console.log(this.props.movie.release_date)}
                {this.props.movie.release_date !== undefined && (
                  <p className="default-movie-row-year">
                    ({this.sanitizeReleaseDate(this.props.movie.release_date)})
                  </p>
                )}
              </div>
            </div>
          ) : (
            <React.Fragment>
              <img
                alt="movie poster"
                src={this.props.movie.poster_src}
                className="nowplaying-img"
                onClick={() => this.openMovieView()}
              ></img>
              {this.props.info === "none" ? (
                <React.Fragment></React.Fragment>
              ) : (
                <div className="overlay">
                  <div className="overlay-content-wrapper">
                    <p className="overlay-text">{this.props.movie.title}</p>
                    {this.props.info === "upcoming" && (
                      <div className="release-date-wrapper">
                        <i className="far fa-calendar-alt align-vertically release-date-icon"></i>
                        <p className="release-date-text">
                          {this.props.movie.release_date}
                        </p>
                      </div>
                    )}
                    {this.props.info === "nowplaying" && (
                      <div className="release-date-wrapper">
                        {this.props.movie.vote_average === 0 ? (
                          <p className="release-date-text">No rating yet</p>
                        ) : (
                          <React.Fragment>
                            <i className="far fa-star release-date-icon"></i>
                            <p className="release-date-text">
                              {this.props.movie.vote_average}
                            </p>
                          </React.Fragment>
                        )}
                      </div>
                    )}
                    {this.props.movie.info}
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default withCookies(MovieRow);
