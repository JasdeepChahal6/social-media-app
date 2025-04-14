import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header/header";
import Nav from "./Nav/Nav";
import Body from "./Body/Body";
import Footer from "./Footer/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    const [posts, setPosts] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
  
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/");
            console.log(response.data);
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

        const timeofPost = new Date().toLocaleString('en-US', { 
            year: '2-digit',
            month: 'numeric', 
            day: 'numeric',  
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true
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
            await axios.post("http://localhost:3000/create", newPost);
            fetchPosts();
        } catch (error) {
            console.error("Error creating post:", error);
        }
        window.location.reload();
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

        const timeofPost = new Date().toLocaleString('en-US', {
            year: '2-digit',
            month: 'numeric', 
            day: 'numeric',  
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        const newPost = {
            id: Date.now(),
            post_text: postText,
            image_url: postImageURL,
            time: timeofPost, 
        };

        setPosts([newPost, ...posts]);

        try {
            await axios.post("http://localhost:3000/create", newPost);
            setPosts([newPost, ...posts]);
        } catch (error) {
            console.error("Error creating post:", error);
        }
        window.location.reload();
    };

    const readPosts = async () => {
        window.location.reload();
    };

    const updatePosts = () => {
        setIsUpdating((prev) => !prev);
    };

    const deletePosts = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/delete/${postId}`);
                setPosts(posts.filter(post => post.id !== postId));
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        } else {
            console.log("Post deletion canceled");
        }
    };

    return (
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
                deletePosts={deletePosts} />
            <Footer />
        </>
    );
}

export default App;
