import React from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from './Post.js';
import posts from './StaticPosts.js';
import CircularProgress from '@mui/material/CircularProgress';

class App extends React.Component {
  constructor() {
	super();
	this.state = {items: posts};
  }
   	
  fetchMorePosts = () => {
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(posts)
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
		  image={post.image}
		  title={post.title}
		  dateString={post.dateString}
		  name={index} key={index}
		  avatarImage={post.avatarImage}
		  postSummary={post.summary}
		  />
	  ))
	  }
        </InfiniteScroll>
      </div>
    );
  }
}


export default App;
