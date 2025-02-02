const mongoose = require('mongoose');

const CandidateSchema = mongoose.Schema({
    name:String,
    gender:String,
    age:Number,
    promises:String,
    party:String,
    votingId:Number,
    votes:Number,
})

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;


