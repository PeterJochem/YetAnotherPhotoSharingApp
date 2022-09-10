import React from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post.js";
import { SERVER_IP, SERVER_PORT } from "./Config.js";
import { Paper } from "@material-ui/core";
import ProfileHeader from "./ProfileHeader.js";
import LoadingPage from "./LoadingPage.js";
import CreatePost from "./CreatePost.js";

class CreatePostPage extends React.Component {
  constructor() {
    super();
    this.state = { user: null };
    this.get_user_data_from_server = this.get_user_data_from_server.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    document.title = "Finstagram";
    await this.get_user_data_from_server();
  }

  get_user_data_from_server() {
    let username = new URLSearchParams(window.location.search).get("username");
    let url = `http://${SERVER_IP}:${SERVER_PORT}/get_user?username=${username}`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ user: json });
      });
  }

  render() {
    return (
      <div>
        {this.state.user == null ? (
          <LoadingPage />
        ) : (
          <div>
            <ProfileHeader user={this.state.user} can_post={true} />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "5%",
              }}
            >
              <CreatePost user={this.state.user} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CreatePostPage;
