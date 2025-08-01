const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    listCount: {
        type: Number,
        default: 0
    }
});

const Agent = mongoose.model('Agent', AgentSchema);
module.exports = Agent;
