import React, { Component } from "react";

class TopTenResult extends Component {
  render() {
    return (
      <div className="top-ten-row-wrapper">
        <div
          className="top-ten-result-row"
          onClick={() => {
            this.props.callback_function(
              this.props.name,
              this.props.img,
              this.props.number,
              this.props.id
            );
          }}
        >
          {this.props.name === "" ? (
            <React.Fragment>
              <div className="top-ten-default">
                <p className="top-ten-default-text">Click to edit.</p>
              </div>
            </React.Fragment>
          ) : (
            <div className="top-ten-nondefault">
              <img className="top-ten-img" src={this.props.img}></img>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TopTenResult;
