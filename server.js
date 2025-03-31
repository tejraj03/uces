const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const session = require("express-session");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: true
}));

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sabs120705*",
    database: "university_course_enrollment",
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            return res.send("Error storing data.");
        }
        console.log("✅ User Registered:", result);
        res.redirect("/login.html");
    });
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("❌ Error fetching user:", err);
            return res.send("Error logging in.");
        }

        if (results.length === 0) {
            return res.send("❌ Invalid Email or Password.");
        }

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.send("❌ Invalid Email or Password.");
        }

        console.log("✅ User Logged In:", user);

        // Store user data in session
        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.redirect("/homepage.html");
    });
});

// Fetch User Data for Homepage
app.get("/user-data", (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false });
    }
    res.json({ success: true, ...req.session.user });
});

// Logout Route
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Error logging out.");
        }
        res.redirect("/login.html");
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "welcome.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
// Add this route to your server.js
