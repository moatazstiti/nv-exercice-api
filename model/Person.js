const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const PersonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    
    age: {
        type: Number,
        required: true,
    },

    favoritefoods : {
        type: [String],
        default: [],
    }
});

module.exports = model('Person',PersonSchema);
