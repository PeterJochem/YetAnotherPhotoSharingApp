import React from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post.js";
import CircularProgress from "@mui/material/CircularProgress";
import { SERVER_IP, SERVER_PORT } from "./Config.js";
import ProfileHeader from "./ProfileHeader.js";
import LoadingPage from "./LoadingPage.js";

class Feed extends React.Component {
  constructor() {
    super();
    this.fetched_posts = [];
    this.num_posts_to_add = 3;
    this.display_index = this.num_posts_to_add;
    this.state = { items: [], viewer: null };
    this.get_all_posts = this.get_all_followed_posts.bind(this);
    this.get_viewer_data_from_server =
      this.get_viewer_data_from_server.bind(this);
    this.delete_post_from_database = this.delete_post_from_database.bind(this);
    this.delete_post_locally = this.delete_post_locally.bind(this);
    this.delete_post = this.delete_post.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    await this.get_viewer_data_from_server();
    this.get_all_posts();
    document.title = "Finstagram";
  }

  async get_all_followed_posts() {
    let viewer = await this.get_viewer_data_from_server();
    let url = `http://${SERVER_IP}:${SERVER_PORT}/get_followed_posts?username=${viewer.username}`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        this.fetched_posts = json;
        let copy_fetched_posts = [...this.fetched_posts];
        this.setState({
          items: copy_fetched_posts.splice(0, this.display_index),
          viewer: viewer,
        });
      });
  }

  get_viewer_data_from_server() {
    let viewer_username = new URLSearchParams(window.location.search).get(
      "username"
    );
    let url = `http://${SERVER_IP}:${SERVER_PORT}/get_user?username=${viewer_username}`;
    return fetch(url).then((response) => response.json());
  }

  fetchMorePosts = () => {
    let copy_fetched_posts = [...this.fetched_posts];
    let start_index = this.display_index;
    let end_index = Math.min(
      this.fetched_posts.length,
      this.display_index + this.num_posts_to_add
    );
    let posts_to_add = copy_fetched_posts.splice(start_index, end_index);
    this.setState({ items: this.state.items.concat(posts_to_add) });
    this.display_index += this.num_posts_to_add;
  };

  delete_post_from_database = (post_id) => {
    let url = `http://${SERVER_IP}:${SERVER_PORT}/delete_post?post_id=${post_id}`;
    return fetch(url).then((response) => response.json());
  };

  delete_post_locally = (post_id) => {
    let copy_fetched_posts = [...this.fetched_posts];
    let filtered_posts = copy_fetched_posts.filter(
      (post) => !(post.id == post_id)
    );
    this.setState({ items: filtered_posts });
  };

  delete_post = (post_id) => {
    this.delete_post_locally(post_id);
    this.delete_post_from_database(post_id);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.viewer != null ? (
          <ProfileHeader user={this.state.viewer} can_post={true} />
        ) : (
          <LoadingPage />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <InfiniteScroll
            dataLength={this.state.items.length}
            next={this.fetchMorePosts}
            hasMore={this.display_index < this.fetched_posts.length}
            loader={<h4> Loading </h4>}
          >
            {this.state.items.map((post_view, index) => (
              <Post
                image_url={post_view.post.image_url}
                username={post_view.post.username}
                date={post_view.post.date}
                name={index}
                key={index}
                avatar_url={post_view.post.avatar_url}
                caption={post_view.post.caption}
                liked={post_view.liked}
                post_id={post_view.post.post_id}
                comments={post_view.post.comments}
                viewer={this.state.viewer}
                delete_post={this.delete_post}
              />
            ))}
          </InfiniteScroll>
        </div>
      </React.Fragment>
    );
  }
}

export default Feed;
