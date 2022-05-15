import React from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from './Post.js';

class App extends React.Component {
  constructor() {
	super();
	this.state = {items: Array.from({length: 20})};
  }
	
	
  fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(Array.from({ length: 20 }))
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
          next={this.fetchMoreData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          {this.state.items.map((i, index) => (
		<Post 
		  image={"https://static.parade.com/wp-content/uploads/2021/07/ted-lasso-season-3.jpg"} 
		  title={"A title"}
		  dateString={"May 20, 2022"}
		  name={index} key={index}
		  avatarImage={"https://cdn10.phillymag.com/wp-content/uploads/2014/07/PW-blake-lively.jpg"}
		  postSummary={"Hello fellas!"}
		  />
	  ))
	  }
        </InfiniteScroll>
      </div>
    );
  }
}


export default App;
