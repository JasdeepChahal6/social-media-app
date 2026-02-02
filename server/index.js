// Express server entry point.
// Repo marker: social-media-app (Phase 2) — Feb 2, 2026.
// Sets up middleware, connects to MySQL, and defines API endpoints.
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

dotenv.config();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());

// const db = mysql.createConnection({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_NAME
// });
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// db.connect((err) => {
//     if(err){
//         console.log(err);
//         return;
//     }
//     else {
//         console.log("success");
//     }
// });

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = user; // Save decoded user info (id, username) to the request
        next(); // Proceed to the next middleware or route handler
    });
}

app.get("/", (req, res) => {
    db.query("SELECT id, post_text, image_url, DATE_FORMAT(time, '%m/%d/%y %h:%i:%s %p') AS time FROM posts ORDER BY time DESC", (err, result) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.json(result);
        }
    });
});

app.post("/create", verifyToken,(req,res) => {
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

app.put("/update/:id", verifyToken,(req, res) => {
    const { id } = req.params;
    const { post_text } = req.body;

    const query = "UPDATE posts SET post_text = ? WHERE id = ?";
    db.query(query, [post_text, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully" });
    });
});


app.delete("/delete/:id", verifyToken,(req, res) => {
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


app.post("/register", (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err,result) => {
        if(err){
            return res.status(500).json({
                message:"Database error", 
                error: err
            });
        }
        if(result.length > 0){
            return res.status(400).json({
                message:"Username already exists",
            });
        }

        try{
            const hashPassword = await bcrypt.hash(password, 10);

            db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, hashPassword], (err, result) => {
                if(err){
                    return res.status(500).json({
                        message:"Database error",
                        error:err
                    });
                }
                return res.status(201).json({
                    message:`${username} has be registered`
                });
            });
        }catch(error){
            return res.status(500).json({
                message:"Error hashing password",
                error:error
            });
        }
    });
});


app.post("/login", (req, res) => {

    const {username, password} = req.body;
    console.log("Attempted login:", username);

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err,result) => {
        if(err){
            console.error("DB error:", err);
            return res.status(500).json({
                message:"Database error",
                error:err
            }); 
        }
        if(result.length == 0){
            return res.status(404).json({
                message: `${username} does not exist`
            });
        }

        const user = result[0];
        // console.log("Password from DB:", user.password);
        // console.log("Password from user:", password);
        try{
            
            const passwordMatch = await bcrypt.compare(password, user.password);

            if(!passwordMatch){
                return res.status(401).json({
                    message: "Wrong password"
                });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },  // Payload
                process.env.JWT_SECRET,                     // Secret key from .env
                { expiresIn: '1h' }                         // Token expires in 1 hour
            );

            return res.status(200).json({
                message: "Login successful",
                token: token 
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error comparing password",
                error: error
            });
        }
    });
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});