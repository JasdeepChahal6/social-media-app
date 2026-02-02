// Express server entry point.
// Sets up middleware, connects to MySQL, and defines API endpoints.
import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

dotenv.config({ override: true });

const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());

// const db = mysql.createConnection({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_NAME
// });
const { Pool } = pg;

const dbConfig = process.env.DATABASE_URL
    ? {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        }
    : {
            host: process.env.PGHOST,
            port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
        };

const db = new Pool(dbConfig);

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

app.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, post_text, image_url, to_char(time, 'MM/DD/YY HH12:MI:SS AM') AS time FROM posts ORDER BY time DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post("/create", verifyToken,(req,res) => {
    const { post_text, image_url } = req.body;

    if(!post_text || !image_url){
        return res.status(400).json("Post and Image required");
    }

    const query = "INSERT INTO posts (post_text, image_url) VALUES ($1, $2)";

    db.query(query, [post_text, image_url])
        .then(() => res.status(201).json({ message: "success" }))
        .catch((err) => res.status(500).json({ message: "database err", error: err }));
});

app.put("/update/:id", verifyToken,(req, res) => {
    const { id } = req.params;
    const { post_text } = req.body;

    const query = "UPDATE posts SET post_text = $1 WHERE id = $2";
    db.query(query, [post_text, id])
        .then((result) => {
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.status(200).json({ message: "Post updated successfully" });
        })
        .catch((err) => res.status(500).json({ message: "Database error", error: err }));
});


app.delete("/delete/:id", verifyToken,(req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM posts WHERE id = $1";
    db.query(query, [id])
        .then((result) => {
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.json({ message: "Post deleted successfully" });
        })
        .catch((err) => res.status(500).json({ message: "Database error", error: err }));
});


app.post("/register", async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
    }

    try {
        const existing = await db.query("SELECT 1 FROM users WHERE username = $1", [username]);
        if (existing.rowCount > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashPassword]);

        return res.status(201).json({ message: `${username} has be registered` });
    } catch (error) {
        return res.status(500).json({ message: "Database error", error });
    }
});


app.post("/login", async (req, res) => {

    const {username, password} = req.body;
    console.log("Attempted login:", username);

    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `${username} does not exist` });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Database error", error });
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});