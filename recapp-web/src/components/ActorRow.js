import React, { Component } from "react";
import { withCookies } from "react-cookie";

class ActorRow extends Component {
  state = {
    token: this.props.cookies.get("recapp-token"),
  };

  openActorView() {
    this.props.cookies.set("actor-id", this.props.actor_id);
    window.location.href = "/actor";
  }

  render() {
    return (
      <div className="actor-row-wrapper">
        <div className="actor-image-wrapper">
          {this.props.image === "https://image.tmdb.org/t/p/originalnull" ? (
            <div className="default-img-bkg">
              <img
                className="actor-default-img"
                src={this.props.def_image}
                onClick={() => this.openActorView()}
              />
            </div>
          ) : (
            <img
              className="actor-image"
              src={this.props.image}
              onClick={() => this.openActorView()}
            />
          )}
        </div>
        <div className="actor-description">
          <p className="actor-name">{this.props.name}</p>
          <p className="actor-character">{this.props.character}</p>
        </div>
      </div>
    );
  }
}

export default withCookies(ActorRow);
