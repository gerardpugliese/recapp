import React, { Component } from "react";

class TopTenRow extends Component {
  render() {
    return (
      <div className="top-ten-row-wrapper">
        <div
          className="top-ten-row"
          onClick={() => {
            this.props.callback_function(
              this.props.name,
              this.props.img,
              this.props.number + 1
            );
          }}
        >
          {this.props.name === "" ? (
            <React.Fragment>
              <div className="top-ten-default">
                <p className="top-ten-default-text">Click to edit.</p>
              </div>
              <p className="top-ten-number">
                {this.props.number + 1} {"."}
              </p>
            </React.Fragment>
          ) : (
            <div className="top-ten-nondefault">
              <img
                alt="top-ten"
                className="top-ten-img"
                src={this.props.img}
              ></img>
              {this.props.number !== undefined && (
                <p className="top-ten-text">
                  {this.props.number} {". "} {this.props.name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TopTenRow;
