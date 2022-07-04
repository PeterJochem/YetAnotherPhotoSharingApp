import React from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from './Post.js';
import posts from './StaticPosts.js';
import CircularProgress from '@mui/material/CircularProgress';
import {SERVER_IP, SERVER_PORT} from "./Config.js"; 

class App extends React.Component {
  constructor() {
	super();
	
	this.fetched_posts = [];
	this.num_posts_to_add = 3;
	this.display_index = this.num_posts_to_add;
	this.state = {items: []};
  	this.get_all_posts = this.get_all_posts.bind(this);
  	this.componentDidMount = this.componentDidMount.bind(this); 
  }	
  
  componentDidMount() {
  	this.get_all_posts(); 
  }

  get_all_posts() {
	let username = "peter";
	let url = `http://${SERVER_IP}:${SERVER_PORT}/get_posts_made_by_user?username=${username}`; 
	console.log("get all posts ran");
	fetch(url).then(response => response.json()).then((json) => {
			this.fetched_posts = json;
			let copy_fetched_posts = [...this.fetched_posts];
			this.setState({items: copy_fetched_posts.splice(0, this.display_index)});
		}
	);
  }

  fetchMorePosts = () => {
     
     console.log("more posts ran");
     let copy_fetched_posts = [...this.fetched_posts];
     let start_index = this.display_index;
     let end_index = Math.min(this.fetched_posts.length, this.display_index + this.num_posts_to_add);
     let posts_to_add = copy_fetched_posts.splice(start_index, end_index);
     this.setState({items: this.state.items.concat(posts_to_add)});
     this.display_index += this.num_posts_to_add;
  };

  render() {
    return (
      <div style = {{ display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center'
                  }}
	>
	
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMorePosts}
          hasMore={this.display_index < this.fetched_posts.length}
          loader={<h4> Loading </h4>}
        >
          {this.state.items.map((post, index) => (
		<Post 
		  image_url={post.image_url}
		  username={post.username}
		  date={post.date}
		  name={index} 
		  key={index}
		  avatar_url={post.avatar_url}
		  caption={post.caption}
		  />
	  ))
	  }
        </InfiniteScroll>
      </div>
    );
  }
}


export default App;
