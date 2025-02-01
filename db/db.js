const mongoose = require('mongoose');
const express = require('express');

const User= require('./schema');

const port = 3000;
const app = express();

app.use(express.json());

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});

const dbconnect = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://jeetandel0404:6yw7VgRUOOf4Hb8S@dotslash.cve9d.mongodb.net/"
        );
        console.log("Database is connected successfully!");
    } catch (e) {
        console.error(e);
    }
};
dbconnect();

// Add a new user
app.post("/user", async (req, res) => {
    try {
        const { name } = req.body;
        const newUser = new User({name});
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});