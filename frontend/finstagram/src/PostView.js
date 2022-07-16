import React from "react";
import { render } from "react-dom";
import Post from './Post.js';
import {SERVER_IP, SERVER_PORT} from "./Config.js"; 
import { Paper } from "@material-ui/core";
import LoadingPage from './LoadingPage.js';


class PostView extends React.Component {
  constructor() {
	super();
	this.state = {post_view: null, viewer: null};
        this.get_viewer_data_from_server = this.get_viewer_data_from_server.bind(this);
	this.get_viewee_data_from_server = this.get_viewee_data_from_server.bind(this);
	this.get_post = this.get_post.bind(this);
	this.componentDidMount = this.componentDidMount.bind(this);  
  }


  async componentDidMount() {
  	document.title = "Finstagram";
  	this.get_post();
  }
  
  get_viewer_data_from_server() {
        let viewer_username = new URLSearchParams(window.location.search).get('viewer_username');
        let url = `http://${SERVER_IP}:${SERVER_PORT}/get_user?username=${viewer_username}`;    
        return fetch(url).then(response => response.json());
  }

  get_viewee_data_from_server() {
        let viewee_username = new URLSearchParams(window.location.search).get('viewee_username');
        let url = `http://${SERVER_IP}:${SERVER_PORT}/get_user?username=${viewee_username}`;    
        return fetch(url).then(response => response.json());
  }
  
  async get_post() {
	let viewer = await this.get_viewer_data_from_server();
	let url = `http://${SERVER_IP}:${SERVER_PORT}/get_posts_by_id?viewer_username=peter&post_id=1`; 
	fetch(url).then(response => response.json()).then((json) => {
                        let post_view = json;
                        this.setState({post_view: post_view, viewer: viewer});
                }
        );	
  }


  render() {
    return (
       <div>
	{this.state.viewer != null ?
	       
		<div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
		<Post
                  image_url={this.state.post_view.post.image_url}
                  username={this.state.post_view.post.username}
                  date={this.state.post_view.post.date}
                  avatar_url={this.state.post_view.post.avatar_url}
                  caption={this.state.post_view.post.caption}
                  liked={this.state.post_view.liked}
                  post_id={this.state.post_view.post.post_id}
                  comments={this.state.post_view.post.comments}
                  viewer={this.state.viewer}
	       />
		</div>
	
		: <LoadingPage /> }
      </div>
    );
  }
}

export default PostView;
