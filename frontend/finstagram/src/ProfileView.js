import React from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from './Post.js';
import {SERVER_IP, SERVER_PORT} from "./Config.js"; 
import { Paper } from "@material-ui/core";
import ProfileHeader from "./ProfileHeader.js";
import LoadingPage from './LoadingPage.js';
import { Redirect } from 'react-router';


class ProfileView extends React.Component {
  constructor() {
	super();
	this.fetched_posts = [];
	this.num_posts_to_add = 3;
	this.display_index = this.num_posts_to_add;
	this.state = {items: [], viewer: null, viewee: null, can_post: false};
  	this.get_all_posts = this.get_all_posts.bind(this);
	this.get_viewer_data_from_server = this.get_viewer_data_from_server.bind(this);
	this.get_viewee_data_from_server = this.get_viewee_data_from_server.bind(this);
	this.sort_posts_by_date = this.sort_posts_by_date;
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

  async get_all_posts() {
	let viewer = await this.get_viewer_data_from_server(); 
	let viewee = await this.get_viewee_data_from_server();
	let url = `http://${SERVER_IP}:${SERVER_PORT}/get_posts_made_by_user?viewee_username=${viewee.username}&viewer_username=${viewer.username}`; 
	fetch(url).then(response => response.json()).then((json) => {
			this.fetched_posts = json;
			let copy_fetched_posts = [...this.fetched_posts];
			let can_post = viewer.username == viewee.username;
			this.setState({items: copy_fetched_posts, viewer: viewer, viewee: viewee, can_post: can_post});
		}
	);
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

  fetchMorePosts = () => {
     let copy_fetched_posts = [...this.fetched_posts];
     let start_index = this.display_index;
     let end_index = Math.min(this.fetched_posts.length, this.display_index + this.num_posts_to_add);
     let posts_to_add = copy_fetched_posts.splice(start_index, end_index);
     this.setState({items: this.state.items.concat(posts_to_add)});
     this.display_index += this.num_posts_to_add;
  };

  delete_post_from_database = (post_id) => {
        let url = `http://${SERVER_IP}:${SERVER_PORT}/delete_post?post_id=${post_id}`;
        fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                }).then(res => {
                console.log("Request to delete post from database completed!");
        });
  }

  delete_post_locally = (post_id) => {
        let copy_fetched_posts = [...this.fetched_posts];
        let filtered_posts = copy_fetched_posts.filter(post => !(post.post.post_id == post_id));
        
	this.display_index -= 1;
	this.setState({items: filtered_posts});
	this.fetched_posts = filtered_posts;
  }


  delete_post = (post_id) => {
	this.delete_post_from_database(post_id)
	this.delete_post_locally(post_id);
        // decrement the index?
  }


  sort_posts_by_date = (posts) => {
	let cmp_function = (post1, post2) => {return (post2.post.date - post1.post.date)};
	return posts.sort(cmp_function)
  }

  render() {
    return (
      <div>
	 {this.state.viewer != null ? <ProfileHeader user={this.state.viewee} can_post={this.state.can_post} /> : <LoadingPage /> }
	 
	 <div style = {{ display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center',
		         paddingTop: "5%"
               }}>
	
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMorePosts}
          hasMore={false}
          loader={<h4> Loading </h4>}
        >
          {this.sort_posts_by_date(this.state.items).map((post_view, index) => (
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
	  ))
	  }
        </InfiniteScroll>
      </div>
     </div>
    );
  }
}

export default ProfileView;
