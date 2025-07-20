import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import axios from "axios";
import { BASE_URL } from "../store/baseUrl";
import Footer from "../components/layout/Footer";

// fallback image (public/fallback.png waa la oggol yahay in si toos ah loo isticmaalo)
const fallbackImage = "/fallback.png";

function SearchPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkFollowing, setCheckFollowing] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");

      // ✅ Ha dirin codsi haddii searchTerm madhan yahay
      if (!searchTerm.trim()) {
        setUsers([]); // optional: nadiifi user list
        return;
      }

      try {
        const res = await axios.get(
          `${BASE_URL}/users/search?query=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startFollowing = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        `${BASE_URL}/users/${id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCheckFollowing(true);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  const unFollow = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        `${BASE_URL}/users/${id}/unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCheckFollowing(false);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Sidebar />
      <div className="w-full max-w-6xl px-6 py-10 mx-auto lg:ml-48">
        <h2 className="text-2xl font-semibold mb-4">Discover People</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-4 bg-white shadow rounded-lg"
            >
              <img
                src={user.avatar ? user.avatar : fallbackImage}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.username}</p>
                <p className="text-sm text-gray-600 truncate w-64">{user.bio}</p>
                <div className="text-xs text-gray-400 mt-1">
                  {user.followers} followers · {user.following} following
                </div>
              </div>
              {user.is_following && !checkFollowing ? (
                <button
                  onClick={() => unFollow(user.id)}
                  className="ml-4 px-4 py-2 text-sm rounded-md font-medium bg-gray-100 text-gray-700"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => startFollowing(user.id)}
                  className="ml-4 px-4 py-2 text-sm rounded-md font-medium bg-blue-600 text-white"
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
}

export default SearchPage;
