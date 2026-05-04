const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ MongoDB connection (Atlas)
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not defined");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.once('open', () => {
    console.log("✅ MongoDB Connected Successfully");
});

db.on('error', (err) => {
    console.error("❌ MongoDB connection error:", err);
});

// ✅ Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

// ✅ Model
const Users = mongoose.model("UserDetails", userSchema);

// ================= ROUTES =================

// ✅ Root route (IMPORTANT)
app.get('/', (req, res) => {
    res.redirect('/login');
});

// ✅ Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// ✅ Login logic
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not registered!' });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: 'Invalid password!' });
        }

        res.json({ success: true, redirect: '/healthcare7/index.html' });

    } catch (err) {
        console.error("Login error:", err);
        res.json({ success: false, message: 'Server error' });
    }
});

// ✅ Register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// ✅ Register logic
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send(`<script>alert("All fields required"); window.location="/register";</script>`);
    }

    try {
        const userExists = await Users.findOne({ email });

        if (userExists) {
            return res.send(`<script>alert("User already exists"); window.location="/login";</script>`);
        }

        const user = new Users({ name, email, password });
        await user.save();

        res.send(`<script>alert("Registration successful"); window.location="/login";</script>`);

    } catch (err) {
        console.error("Register error:", err);
        res.send(`<script>alert("Error occurred"); window.location="/register";</script>`);
    }
});

// ✅ Dynamic PORT (CRITICAL for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});