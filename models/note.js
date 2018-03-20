'use strict';

const mongoose= require('mongoose');


const noteSchema = new mongoose.Schema({
  title: { type: String, index: true },
  content: { type: String, index: true },
  created: { type: Date},
});
  
noteSchema.index({ title: 'text',  content: 'text'});


//what does this do exactly?//What is a ret? Is it a return? (Mentor help)
noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const NoteModel = mongoose.model('Note', noteSchema);

module.exports = NoteModel;