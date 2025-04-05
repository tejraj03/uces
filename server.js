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
    password: "123456",                        // Sabs120705*
    database: "University_Course_Enrollment",  // university_course_enrollment
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
    const { name, email, password, role, course_id } = req.body; // include course_id from form
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
        if (err) {
            console.error("❌ Error inserting user:", err);
            return res.send("Error storing user.");
        }

        const userId = result.insertId;

        // If role is student, insert into student table
        if (role === "student") {
            const studentSql = "INSERT INTO students (student_id, student_name) VALUES (?, ?)";
            db.query(studentSql, [userId, name], (err2) => {
                if (err2) {
                    console.error("❌ Error inserting into student table:", err2);
                    return res.send("Error storing student data.");
                }
                console.log("✅ Student registered with name.");
                return res.redirect("/login.html");
            });
        } else {
            res.redirect("/login.html");
        }
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

        // Redirect based on role
        if (user.role === "instructor") {
            res.redirect("/instructor.html");  // Redirect instructors
        } else {
            res.redirect("/homepage.html");   // Redirect other users
        }
        //res.redirect("/homepage.html");
    });
});

// Fetch User Data for Homepage
app.get("/user-data", (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false });
    }
    res.json({
        success: true,
        user_id: req.session.user.user_id,
        name: req.session.user.name,
        email: req.session.user.email,
        role: req.session.user.role
    });
});

// for instructor user information
app.get("/get-instructor-data", (req, res) => {
    if (!req.session.user || req.session.user.role !== "instructor") {
        return res.json({ success: false, message: "Unauthorized access" });
    }

    const sql = `
        SELECT i.instructor_id, i.instructor_name, i.course_id, c.course_name 
        FROM instructor i
        JOIN courses c ON i.course_id = c.course_id
        WHERE i.instructor_id = ?
    `;

    db.query(sql, [req.session.user.user_id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching instructor data:", err);
            return res.json({ success: false, error: err });
        }

        if (results.length > 0) {
            res.json({ success: true, ...results[0] });
        } else {
            res.json({ success: false, message: "No instructor found." });
        }
    });
});



// Fetch Instructor Details
app.get("/get-instructor-data", (req, res) => {
    if (!req.session.user || req.session.user.role !== "instructor") {
        console.log("🚨 Unauthorized Access Attempt");
        return res.json({ success: false, message: "Unauthorized access" });
    }

    console.log("🔍 Fetching data for instructor ID:", req.session.user.user_id);

    const sql = `
        SELECT i.instructor_id, i.instructor_name, i.course_id, c.course_name 
        FROM instructor i
        JOIN courses c ON i.course_id = c.course_id
        WHERE i.instructor_id = ?
    `;

    db.query(sql, [req.session.user.user_id], (err, results) => {
        if (err) {
            console.error("❌ MySQL Query Error:", err);
            return res.json({ success: false, error: err });
        }

        if (results.length > 0) {
            console.log("✅ Data Found:", results[0]);
            res.json({ success: true, ...results[0] });
        } else {
            console.log("❌ No Data Found for Instructor:", req.session.user.user_id);
            res.json({ success: false, message: "No instructor found." });
        }
    });
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

// Update Email
app.post("/update-email", async (req, res) => {
    const { newEmail, currentPassword } = req.body;
    const user = req.session.user;

    const sql = "SELECT * FROM users WHERE user_id = ?";
    db.query(sql, [user.user_id], async (err, results) => {
        if (err || results.length === 0) return res.json({ message: "User not found." });

        const isMatch = await bcrypt.compare(currentPassword, results[0].password);
        if (!isMatch) return res.json({ message: "Incorrect password." });

        db.query("UPDATE users SET email = ? WHERE user_id = ?", [newEmail, user.user_id], err2 => {
            if (err2) return res.json({ message: "Failed to update email." });

            req.session.user.email = newEmail; // update session
            res.json({ message: "Email updated successfully." });
        });
    });
});

// Update Password
app.post("/update-password", async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.session.user;

    const sql = "SELECT * FROM users WHERE user_id = ?";
    db.query(sql, [user.user_id], async (err, results) => {
        if (err || results.length === 0) return res.json({ message: "User not found." });

        const isMatch = await bcrypt.compare(currentPassword, results[0].password);
        if (!isMatch) return res.json({ message: "Incorrect current password." });

        const hashedNew = await bcrypt.hash(newPassword, 10);
        db.query("UPDATE users SET password = ? WHERE user_id = ?", [hashedNew, user.user_id], err2 => {
            if (err2) return res.json({ message: "Failed to update password." });

            res.json({ message: "Password updated successfully." });
        });
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
app.get("/courses", (req, res) => {
    const sql = "SELECT course_id, course_name, credits FROM courses";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching courses:", err);
            return res.status(500).json({ success: false, message: "Error fetching courses." });
        }
        res.json({ success: true, courses: results });
    });
});
app.post("/enrollment", (req, res) => {
    const { student_id, course_id, action } = req.body;

    if (!['add', 'drop'].includes(action)) {
        return res.status(400).send("Invalid action.");
    }

    const sql =
        action === "add"
            ? "INSERT INTO enrollment (student_id, course_id, status) VALUES (?, ?, 'pending') ON DUPLICATE KEY UPDATE status = 'pending'"
            : "UPDATE enrollment SET status = 'dropped' WHERE student_id = ? AND course_id = ?";

    db.query(sql, [student_id, course_id], (err) => {
        if (err) {
            console.error(`❌ Error processing ${action} request:`, err);
            return res.status(500).send(`Error processing ${action} request.`);
        }
        res.send(`Request to ${action} course submitted.`);
    });
});