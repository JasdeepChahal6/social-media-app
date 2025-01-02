import React, { useState } from "react";
import Header from "./Header/header";
import Nav from "./Nav/Nav";
import Body from "./Body/Body";
import Footer from "./Footer/Footer"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {

    const [post, setPost] = useState([]);

    const createRandomPost = async () => {
        let randomNum = Math.floor(Math.random() * 100 + 1);
    const postImageURL = `https://picsum.photos/200/300?random=${randomNum}`;
        let postText = "...";

    const timeofPost = new Date().toLocaleString('en-US', {
        year:'2-digit',
        month:'numeric', 
        day: 'numeric',  
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true });

    try{
        const response = await fetch("https://api.quotable.io/random");
        if(!response.ok){
            throw new Error("COULD NOT FETCH");
        }
        const data = await response.json();
        console.log(data);
        postText = data.content;
    } catch(error){
        console.error(error);
    }

    const newPost = {
        id: Date.now(),
        text: postText,
        imageUrl: postImageURL,
        time: timeofPost,
    }
    setPost([newPost, ...post]);
    }

    const createOwnPost = () => {
        const postText = prompt("Enter Post Text:");
        const postImageURL = prompt("Enter image URL");

        if(!postText){
             alert("Text is Required");
             return;
             }

        if(!postImageURL){
            alert("Image is Required");
            return;
            }

        const timeofPost = new Date().toLocaleString('en-US', {
            year:'2-digit',
            month:'numeric', 
            day: 'numeric',  
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        const newPost = {
            id: Date.now(),
            text: postText,
            imageUrl: postImageURL,
            time: timeofPost,
        }
        setPost([newPost, ...post]);
    }

    

    return(
        <>
        <Header />
        <Nav createOwnPost={createOwnPost} createRandomPost={createRandomPost}/>
        <Body posts={post}/>
        {/* <Footer /> */}
        </>
    );
}

export default App
