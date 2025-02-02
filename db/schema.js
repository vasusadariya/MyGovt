const mongoose = require('mongoose');


const CandidateSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    promises: String,
    party: String,
    votingId: Number,
    votes: { type: Number, default: 0 },
  });

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;


