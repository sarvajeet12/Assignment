const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true,
    },
});

const List = mongoose.model('List', ListSchema);

module.exports = List;