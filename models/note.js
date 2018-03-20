'use strict';

const mongoose= require('mongoose');


const noteSchema = new mongoose.Schema({
  title: { type: String, index: true },
  content: { type: String, index: true },
  created: { type: Date},
});
  
noteSchema.index({ title: 'text',  content: 'text'});

const NoteModel = mongoose.model('Note', noteSchema);

module.exports = NoteModel;