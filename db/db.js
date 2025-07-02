import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import Candidate from './schema.js';

const port = 8080;
const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});

const dbconnect = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://sadariyavasu02:W0IblExdomTGdVDY@cluster0.kxoxrvv.mongodb.net/dotslash"
        );
        console.log("Database is connected successfully!");
    } catch (e) {
        console.error(e);
    }
};
dbconnect();

// 🟢 Add a new candidate
app.post("/candidates", async (req, res) => {
    try {
      const { name, gender, age, promises, party, votingId } = req.body;
  
      const newCandidate = new Candidate({
        name,
        gender,
        age,
        promises,
        party,
        votingId,
        votes: 0,
      });
  
      await newCandidate.save();
      res.status(201).json({ message: "Candidate created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });

app.get("/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ votes: -1 }); // Highest votes first
        const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

        res.status(200).json({ totalVotes, candidates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/candidate", async (req, res) => {
    try {
        const candidates = await Candidate.find(); 
        res.status(200).json({ candidates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/vote/:id", async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        candidate.votes += 1; // Increase vote count
        await candidate.save();

        res.status(200).json({ message: "Vote recorded", candidate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 🟢 Get a single candidate by ID
app.get("/candidates/:id", async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});