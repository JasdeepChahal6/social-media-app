import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const corsOptions = {
    origin: [process.env.FRONTEND_URL],
};

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
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

    const query = "INSERT INTO posts (post_text, image_url) VALUES (?, ?)";

    db.query(query, [post_text, image_url], (err, result) => {
        if(err){
            return res.status(500).json({message:"database err", error: err});
        }
        res.status(201).json({message:"success"});
    });
});

app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM posts WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({ message: "Post deleted successfully" });
    });
});


app.delete("/delete/:id", (req,res) => {
    const { id } = req.params;

    const postIndex = posts.findIndex(post => post.id === parseInt(id));

    if (postIndex !== -1) {
        const deletedPost = posts.splice(postIndex, 1);
        res.json(deletedPost);
    } else {
        res.status(404).json({ message: "Post not found" });
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});