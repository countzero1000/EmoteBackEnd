
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notesSchema = new mongoose.Schema({

    _id : Schema.Types.ObjectId,
    content:String,
    mood:String

})



module.exports = mongoose.model('notes',notesSchema);