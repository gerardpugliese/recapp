import React, { Component } from "react";
import { withCookies } from "react-cookie";

class ActorRow extends Component {
  state = {
    token: this.props.cookies.get("recapp-token"),
    default_actor_image:
      "https://firebasestorage.googleapis.com/v0/b/my-recapp.appspot.com/o/images%2Fnewactordefault.png?alt=media&token=24bee84d-b03b-47ee-8c89-a153b1b748c1",
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
                alt="default-actor"
                src={this.state.default_actor_image}
                onClick={() => this.openActorView()}
              />
            </div>
          ) : (
            <img
              className="actor-image"
              alt="actor"
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
