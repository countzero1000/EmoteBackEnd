
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const personSchema = new mongoose.Schema({

    _id : Schema.Types.ObjectId,
    faceId : String,
    name : String,
    notesGeneral : String,
    notesAnger: String,
    notesContempt: String,
    notesDisgust: String,
    notesFear: String,
    notesHappiness: String,
    notesNeutral: String,
    notesSadness: String,
    notesSurprise: String 


})



module.exports = mongoose.model('person',personSchema);