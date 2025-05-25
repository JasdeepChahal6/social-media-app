import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header/Header";
import Nav from "./Nav/Nav";
import Body from "./Body/Body";
import Footer from "./Footer/Footer";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { useAuth } from "./Contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const { token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://social-media-app-backend-zenq.onrender.com/");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createRandomPost = async () => {
    let randomNum = Math.floor(Math.random() * 100 + 1);
    const postImageURL = `https://picsum.photos/200/300?random=${randomNum}`;
    let postText = "...";

    const timeofPost = new Date().toLocaleString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      const response = await axios.get("https://api.quotable.io/random");
      postText = response.data.content;
    } catch (error) {
      console.error("Error fetching quote:", error);
    }

    const newPost = {
      id: Date.now(),
      post_text: postText,
      image_url: postImageURL,
      time: timeofPost,
    };

    setPosts([newPost, ...posts]);

    try {
      await axios.post("https://social-media-app-backend-zenq.onrender.com/create", newPost, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      fetchPosts(); // refresh posts after creation
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const createOwnPost = async () => {
    const postText = prompt("Enter Post Text:");
    const postImageURL = prompt("Enter image URL");

    if (!postText) {
      alert("Text is Required");
      return;
    }

    if (!postImageURL) {
      alert("Image is Required");
      return;
    }

    const timeofPost = new Date().toLocaleString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newPost = {
      id: Date.now(),
      post_text: postText,
      image_url: postImageURL,
      time: timeofPost,
    };

    setPosts([newPost, ...posts]);

    try {
      await axios.post("https://social-media-app-backend-zenq.onrender.com/create", newPost, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      fetchPosts(); // refresh posts after creation
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const readPosts = async () => {
    window.location.reload();
  };

  const updatePosts = () => {//for nav
    setIsUpdating((prev) => !prev);
  };

  const editPost = async (postId, newText) => {//for body
    try {
      await axios.put(
        `https://social-media-app-backend-zenq.onrender.com/update/${postId}`,
        { post_text: newText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, post_text: newText } : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePosts = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`https://social-media-app-backend-zenq.onrender.com/delete/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token here
          },
        });
        setPosts(posts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    } else {
      console.log("Post deletion canceled");
    }
  };

  const PrivateRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" replace />}
        />

        {/* Private route for the main app */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Header />
                <Nav
                  createOwnPost={createOwnPost}
                  createRandomPost={createRandomPost}
                  readPosts={readPosts}
                  updatePosts={updatePosts}
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                  deletePosts={deletePosts}
                  isDeleting={isDeleting}
                  setIsDeleting={setIsDeleting}
                />
                <Body
                  posts={posts}
                  isUpdating={isUpdating}
                  setPosts={setPosts}
                  isDeleting={isDeleting}
                  deletePosts={deletePosts}
                  editPost={editPost}
                />
                <Footer />
              </>
            </PrivateRoute>
          }
        />
        {/* Catch-all redirect to home or login */}
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
