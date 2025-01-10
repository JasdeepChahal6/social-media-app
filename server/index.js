import express from "express";
import mysql from "mysql2";
import cors from "cors";
const corsOptions = {
    origin: ["http://localhost:5173"],
};

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Jaslovessoccer88!",
    database:"social_media_db"
});

db.connect((err) => {
    if(err){
        console.log(err);
        return;
    }
    else {
        console.log("success");
    }
});

app.get("/", (req, res) => {
    db.query("SELECT id, post_text, image_url, DATE_FORMAT(time, '%m/%d/%y %h:%i %p') AS time FROM posts ORDER BY time DESC", (err, result) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.json(result);
        }
    });
});

app.post("/create", (req,res) => {
    const { post_text, image_url } = req.body;

    if(!post_text || !image_url){
        return res.status(400).json("Post and Image required");
    }

    const time = new Date().toLocaleString('en-US', {
        year: '2-digit',
        month: 'numeric', 
        day: 'numeric',  
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });

    const query = "INSERT INTO posts (post_text, image_url) VALUES (?, ?)";

    db.query(query, [post_text, image_url, time], (err, result) => {
        if(err){
            return res.status(500).json({message:"database err", error: err});
        }
        res.status(201).json({message:"success"});
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});