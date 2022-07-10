import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Feed from './Feed';
import ProfileView from "./ProfileView.js";
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>  
 <React.StrictMode>

   <Routes>
      <Route path="/feed" element={<Feed />} >
		<Route path=":username"  />
      </Route>
      
      <Route path="profile_view" element={<ProfileView />}>
      		<Route path=":viewer_username:viewee_username"  />
      </Route> 
      <Route path="post_view" element={<h1> Add a feature to view a single post. Cool to be able to get a link to a single post</h1>}>
                <Route path=":post_id" />
      </Route>

      <Route
      	path="*"
      	element={
        	<main style={{ padding: "1rem" }}>
          		<p>There's nothing here!</p>
       	 	</main>
      	}
      />
    </Routes>

  </React.StrictMode>
</BrowserRouter>
);

reportWebVitals();
