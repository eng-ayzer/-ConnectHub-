import { useEffect, useState } from "react";
import Sidebar from "../Components/layout/Sidebar";

import axios from "axios";
import { BASE_URL } from "../store/baseUrl";
import fallbackImage from "../public/fallback.png";
import Footer from "../components/layout/Footer";


function SearchPage() {
  
  const [users , setUsers] = useState([]);
  const [searchTerm , setSearchTerm] = useState("");
  const [followStatus, setFollowStatus] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  

  useEffect(() => {
    const fetctUsers = async() => {
        const token = localStorage.getItem("authToken");
   await axios.get(`${BASE_URL}/users/search?query=${searchTerm}`, {headers: {
      Authorization: `Bearer ${token}`,
      
    },})
     .then(Response => setUsers(Response.data))
     .catch(err => console.error("API error:", err));
    }
    
   fetctUsers()
  },[searchTerm])

  const filteredUsers = users.filter(user =>
    
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
    console.log("filterUsers", filteredUsers)
  

 const startFollowing = async (id) => {
  console.log("following",id)
  setLoadingStates(prev => ({ ...prev, [id]: true }));
  const token = localStorage.getItem("authToken");
  console.log("token",token)
  await axios.post(`${BASE_URL}/users/${id}/follow`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    
  } )
  .then(Response => {
    setFollowStatus(prev => ({ ...prev, [id]: true }));
    // Update the user's follow status in the users array
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, is_following: true } : user
      )
    );
  })
  .catch(err => console.error("API err;",err))
  .finally(() => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  });
 }

 const unFollow = async (id) => {
  console.log("unfollowing",id)
  setLoadingStates(prev => ({ ...prev, [id]: true }));
  const token = localStorage.getItem("authToken");
  await axios.post(`${BASE_URL}/users/${id}/unfollow`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
   },
    
  } )
  .then(Response => {
    setFollowStatus(prev => ({ ...prev, [id]: false }));
    // Update the user's follow status in the users array
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, is_following: false } : user
      )
    );
  })
  .catch(err => console.error("API err;",err))
  .finally(() => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  });
 }

  return (

    <div className="flex flex-col lg:flex-row w-full ">
      <Sidebar />
    <div className=" w-full max-w-6xl px-6 py-10 mx-auto lg:ml-48">
      
<h2 className="text-2xl font-semibold mb-4">Discover People</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="flex items-center p-4 bg-white shadow rounded-lg">
            <img 
              src={user.avatar || fallbackImage} 
              alt={user.name} 
              className="w-16 h-16 rounded-full object-cover border-3 border-blue-200 shadow-md hover:shadow-lg transition-all duration-200"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.username}</p>
              <p className="text-sm text-gray-600 truncate w-64">{user.bio}</p>
              <div className="text-xs text-gray-400 mt-1">
                {user.followers} followers · {user.following} following
              </div>
            </div>
            {loadingStates[user.id] ? (
              <button
                disabled
                className="ml-4 px-4 py-2 text-sm rounded-md font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Loading...
              </button>
            ) : user.is_following ? (
              <button
                onClick={() => unFollow(user.id)}
                className="ml-4 px-4 py-2 text-sm rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Following
              </button>
            ) : (
              <button
                onClick={() => startFollowing(user.id)}
                className="ml-4 px-4 py-2 text-sm rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Follow
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
      <div className="flex-grow"></div>
      {/* Footer is only visible on mobile devices */}
      <Footer />
    </div>
  );
};

export default SearchPage;