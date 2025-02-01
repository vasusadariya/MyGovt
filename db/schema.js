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

const User = mongoose.model("User", userSchema);
const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;


