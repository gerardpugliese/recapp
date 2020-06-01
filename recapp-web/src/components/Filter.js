import React, { Component } from "react";

class Filter extends Component {
  returnFilter() {
    let filter_type = this.props.filter_type;
    let filter_name = this.props.filter_name;
    this.props.callback_function(filter_name, filter_type);
  }
  render() {
    return (
      <p
        className="media-results"
        onClick={() => {
          this.returnFilter();
        }}
      >
        {this.props.filter_name}
      </p>
    );
  }
}

export default Filter;
