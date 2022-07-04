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
	this.state = {items: this.fetched_posts};
  	this.get_all_posts = this.get_all_posts.bind(this);
  	this.componentDidMount = this.componentDidMount.bind(this); 
  }	
  
  componentDidMount() {
  	this.get_all_posts(); 
  }

  get_all_posts() {
	let username = "peter";
	let url = `http://${SERVER_IP}:${SERVER_PORT}/get_posts_made_by_user?username=${username}`; 
	console.log(url);
	fetch(url).then(response => response.json()).then((json) => this.setState({items: json}));
  }

  fetchMorePosts = () => {
    setTimeout(() => {
      this.setState({
        items: this.state.items //.concat(posts)
      });
    }, 1500);
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
          hasMore={true}
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
