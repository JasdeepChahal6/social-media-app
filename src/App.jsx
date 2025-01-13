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
    };

    return (
        <>
            <Header />
            <Nav createOwnPost={createOwnPost} createRandomPost={createRandomPost} />
            <Body posts={posts} />
            <Footer />
        </>
    );
}

export default App;