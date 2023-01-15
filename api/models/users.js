const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type:String,
        required:true
    },
    number: { 
        type: Number, 
        required: true, 
        unique: true, 
       
    },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Users', usersSchema);