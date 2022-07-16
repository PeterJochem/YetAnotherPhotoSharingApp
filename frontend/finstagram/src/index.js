import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Feed from './Feed';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ProfileView from './ProfileView.js';
import PostView from "./PostView.js";


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
      <Route path="post_view" element={<PostView />}>
                <Route path=":post_id:viewer_username:viewee_username" />
      </Route>	
       <Route path="create_new_post" element={<PostView />}>
                <Route path=":username" />
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
